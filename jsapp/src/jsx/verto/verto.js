'use strict';

export class Verto {
	constructor() {
		this._ws_socket = null;
		this.q = [];
		this._ws_callbacks = {};
		this._current_id = 0;

		this.generateGUID = (typeof(window.crypto) !== 'undefined' &&
			typeof(window.crypto.getRandomValues) !== 'undefined') ? function() {
			// If we have a cryptographically secure PRNG, use that
			// http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
			var buf = new Uint16Array(8);
			window.crypto.getRandomValues(buf);
			var S4 = function(num) {
				var ret = num.toString(16);
				while (ret.length < 4) {
					ret = "0" + ret;
				}
				return ret;
			};
			return (S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-" + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5]) + S4(buf[6]) + S4(buf[7]));
		} : function() {
			// Otherwise, just use Math.random
			// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		};
	}

	connect(video_params: object, callbacks?: object) {
		console.log("verto connect", callbacks);
		const _this = this;
		this.options = Object.assign({
			login: null,
			passwd: null,
			socketUrl: null,
			tag: null,
			localTag: null,
			videoParams: {},
			audioParams: {},
			loginParams: {},
			deviceParams: {onResCheck: null},
			userVariables: {},
			iceServers: false,
			ringSleep: 6000,
			sessid: null,
			onmessage: function(e) {
				return _this.handleMessage(e.eventData);
			},
			onWSConnect: function(o) {
				console.log("connected!!!!");
				o.call('login', {});
			},
			onWSLogin: function(verto, success) {
			},
			onWSClose: function(verto, success) {
				this.purge();
			}
		}, video_params, callbacks);

		console.error("options", this.options);
		console.error("video_params", video_params);

		if (this.options.deviceParams.useCamera) {
			// $.FSRTC.getValidRes(verto.options.deviceParams.useCamera, verto.options.deviceParams.onResCheck);
		}

		if (!this.options.deviceParams.useMic) {
			this.options.deviceParams.useMic = "any";
		}

		if (!this.options.deviceParams.useSpeak) {
			this.options.deviceParams.useSpeak = "any";
		}

		if (this.options.sessid) {
			this.sessid = this.options.sessid;
		} else {
			this.sessid = localStorage.getItem("verto_session_uuid") || this.generateGUID();
			localStorage.setItem("verto_session_uuid", this.sessid);
		}

		this.dialogs = {};
		this.callbacks = callbacks || {};
		this.eventSUBS = {};
		this.connectSocket();

		var tag = this.options.tag;
		if (typeof(tag) === "function") {
		  tag = tag();
		}

		if (this.options.ringFile && this.options.tag) {
			this.ringer = document.getElementById(tag);
		}

		// this.call('login', {});
	}

	connectSocket() {
		var self = this;

		if (self.to) {
			clearTimeout(self.to);
		}

		if (!self.socketReady()) {
			self.authing = false;

			if (self._ws_socket) {
				delete self._ws_socket;
			}

			// No socket, or dying socket, let's get a new one.
			self._ws_socket = new WebSocket(self.options.socketUrl);

			if (self._ws_socket) {
				// Set up onmessage handler.
				self._ws_socket.onmessage = function(event) { self._onMessage(event); };
				self._ws_socket.onclose = function (w) {
					if (!self.ws_sleep) {
						self.ws_sleep = 1000;
					}

					if (self.options.onWSClose) {
						self.options.onWSClose(self);
					}

					console.error("Websocket Lost " + self.ws_cnt + " sleep: " + self.ws_sleep + "msec");

					self.to = setTimeout(function() {
						console.log("Attempting Reconnection....");
						self.connectSocket();
					}, self.ws_sleep);

					self.ws_cnt++;

					if (self.ws_sleep < 3000 && (self.ws_cnt % 10) === 0) {
						self.ws_sleep += 1000;
					}
				};

				// Set up sending of message for when the socket is open.
				self._ws_socket.onopen = function() {
					if (self.to) {
						clearTimeout(self.to);
					}

					self.ws_sleep = 1000;
					self.ws_cnt = 0;

					if (self.options.onWSConnect) {
						self.options.onWSConnect(self);
					}

					var req;
					while ((req = self.q.pop())) {
						self._ws_socket.send(req);
					}
				};
			}
		}

		return self._ws_socket ? true : false;
	}

	socketReady() {
		if (this._ws_socket === null || this._ws_socket.readyState > 1) {
			return false;
		}

		return true;
	}

	purge() {

	}

	call(method, params, success_cb, error_cb) {
		// Construct the JSON-RPC 2.0 request.

		if (!params) {
			params = {};
		}

		if (this.sessid) {
			params.sessid = this.sessid;
		}

		var request = {
			jsonrpc : '2.0',
			method  : method,
			params  : params,
			id      : this._current_id++  // Increase the id counter to match request/response
		};

		if (!success_cb) {
			success_cb = function(e){console.log("Success: ", e);};
		}

		if (!error_cb) {
			error_cb = function(e){console.log("Error: ", e);};
		}

		var request_json = JSON.stringify(request);

		if (this._ws_socket.readyState < 1) {
			// The websocket is not open yet; we have to set sending of the message in onopen.
			self = this; // In closure below, this is set to the WebSocket.  Use self instead.
			this.q.push(request_json);
		} else {
			// We have a socket and it should be ready to send on.
			// console.log(request_json);
			this._ws_socket.send(request_json);
		}

		// Setup callbacks.  If there is an id, this is a call and not a notify.
		if ('id' in request && typeof(success_cb) !== 'undefined') {
			this._ws_callbacks[request.id] = { request: request_json, request_obj: request, success_cb: success_cb, error_cb: error_cb };
		}
	}

	_onMessage(event) {
		// Check if this could be a JSON RPC message.
		var response;
		const self = this;

		// Special sub proto
		if (event.data[0] == "#" && event.data[1] == "S" && event.data[2] == "P") {
			if (event.data[3] == "U") {
			this.up_dur = parseInt(event.data.substring(4));
			} else if (this.speedCB && event.data[3] == "D") {
				this.down_dur = parseInt(event.data.substring(4));

				var up_kps = (((this.speedBytes * 8) / (this.up_dur / 1000)) / 1024).toFixed(0);
				var down_kps = (((this.speedBytes * 8) / (this.down_dur / 1000)) / 1024).toFixed(0);

				console.info("Speed Test: Up: " + up_kps + " Down: " + down_kps);
				this.speedCB(event, { upDur: this.up_dur, downDur: this.down_dur, upKPS: up_kps, downKPS: down_kps });
				this.speedCB = null;
			}

			return;
		}

		response = JSON.parse(event.data);

		/// @todo Make using the jsonrcp 2.0 check optional, to use this on JSON-RPC 1 backends.

		if (typeof(response) === 'object' &&
			'jsonrpc' in response &&
			response.jsonrpc === '2.0') {

			/// @todo Handle bad response (without id).
			// If this is an object with result, it is a response.
			if ('result' in response && this._ws_callbacks[response.id]) {
				// Get the success lcallback.
				var success_cb = this._ws_callbacks[response.id].success_cb;

				// set the sessid if present
				// if ('sessid' in response.result && !this.options.sessid || (this.options.sessid != response.result.sessid)) {
				//     this.options.sessid = response.result.sessid;
				//     if (this.options.sessid) {
				//         console.log("setting session UUID to: " + this.options.sessid);
				//     }
				// }

				// Delete the callback from the storage.
				delete this._ws_callbacks[response.id];

				// Run callback with result as parameter.
				success_cb(response.result, this);
				return;
			} else if ('error' in response && self._ws_callbacks[response.id]) {
				// If this is an object with error, it is an error response.

				// Get the error callback.
				var error_cb = self._ws_callbacks[response.id].error_cb;
				var orig_req = self._ws_callbacks[response.id].request;

				// if this is an auth request, send the credentials and resend the failed request
				if (!self.authing && response.error.code == -32000 && self.options.login && self.options.passwd) {
					self.authing = true;

					self.call("login", { login: self.options.login, passwd: self.options.passwd, loginParams: self.options.loginParams,
						userVariables: self.options.userVariables},
						this._ws_callbacks[response.id].request_obj.method == "login" ? function(e) {
							self.authing = false;
							console.log("logged in");
							delete self._ws_callbacks[response.id];

							if (self.options.onWSLogin) {
								self.options.onWSLogin(true, self);
							}
						} : function(e) {
							self.authing = false;
							console.log("logged in, resending request id: " + response.id);
							var socket = self.options.getSocket(self.wsOnMessage);
							if (socket !== null) {
								socket.send(orig_req);
							}
							if (self.options.onWSLogin) {
								self.options.onWSLogin(true, self);
							}
						},

						function(e) {
							console.log("error logging in, request id:", response.id);
							delete self._ws_callbacks[response.id];
							error_cb(response.error, this);
							if (self.options.onWSLogin) {
							self.options.onWSLogin(false, self);
							}
						});
					return;
				}

				// Delete the callback from the storage.
				delete self._ws_callbacks[response.id];

				// Run callback with the error object as parameter.
				error_cb(response.error, self);
				return;
			}
		}

		// This is not a JSON-RPC response.  Call the fallback message handler, if given.
		if (typeof(this.options.onmessage) === 'function') {
			event.eventData = response;
			if (!event.eventData) {
				event.eventData = {};
			}

			var reply = this.options.onmessage(event);

			if (reply && typeof(reply) === "object" && event.eventData.id) {
				var msg = {
					jsonrpc: "2.0",
					id: event.eventData.id,
					result: reply
				};

				if (this._ws_socket !== null) {
					this._ws_socket.send($.toJSON(msg));
				}
			}
		}
	}

	handleMessage(msg) {
		console.log("handle message", msg);
	}

	sendMethod(method, params, success_cb, error_cb) {
		this.call(method, params, function(e) {
			/* Success */
			// this.processReply(method, true, e);
			console.log("sendMethod success", e);
			if (success_cb) success_cb(e);
		}, function(e) {
			/* Error */
			console.log("sendMethod ERR", e);
			if (error_cb) error_cb(e);
			// verto.processReply(method, false, e);
		});
	}

	subscribe(channel, sparams) {
		verto.sendMethod("verto.subscribe", {
			eventChannel: channel,
			subParams: sparams
		});
	}

	unsubscribe(handle) {

	}

	broadcast(channel, params) {

	}
}

var singleton = new Verto(null);
export default singleton;
