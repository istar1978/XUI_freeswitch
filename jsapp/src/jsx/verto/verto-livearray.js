'use strict';

function del_array(array, name) {
    var r = [];
    var len = array.length;

    for (var i = 0; i < len; i++) {
        if (array[i] != name) {
            r.push(array[i]);
        }
    }

    return r;
}

export class VertoHashArray {
	constructor() {
		this.hash = {};
		this.array = [];
	}

	reorder(a) {
		array = a;
		var h = hash;
		hash = {};

		var len = array.length;

		for (var i = 0; i < len; i++) {
			var key = array[i];
			if (h[key]) {
				hash[key] = h[key];
				delete h[key];
			}
		}
		h = undefined;
	};

	clear() {
		this.hash = undefined;
		this.array = undefined;
		this.hash = {};
		this.array = [];
	}

	add(name, val, insertAt) {
		var redraw = false;

		if (!this.hash[name]) {
			if (insertAt === undefined || insertAt < 0 || insertAt >= this.array.length) {
				this.array.push(name);
			} else {
				var x = 0;
				var n = [];
				var len = this.array.length;

				for (var i = 0; i < len; i++) {
					if (x++==insertAt) {
						n.push(name);
					}
					n.push(this.array[i]);
				}

				this.array = undefined;
				this.array = n;
				n = undefined;
				redraw = true;
			}
		}

		this.hash[name] = val;

		return redraw;
	}

	del(name) {
		var r = false;

		if (this.hash[name]) {
			this.array = del_array(this.array, name);
			delete this.hash[name];
			r = true;
		} else {
			console.error("can't del nonexistant key " + name);
		}

		return r;
	}

	get(name) {
		return hash[name];
	}

	order() {
		return array;
	}

	hash() {
		return hash;
	}

	indexOf(name) {
		var len = this.array.length;

		for (var i = 0; i < len; i++) {
			if (this.array[i] == name) {
				return i;
			}
		}
	}

	arrayLen() {
		return this.array.length;
	}

	asArray() {
		var r = [];

		var len = this.array.length;

		for (var i = 0; i < len; i++) {
			var key = this.array[i];
			r.push(this.hash[key]);
		}

		return r;
	}

	each(cb) {
		var len = this.array.length;

		for (var i = 0; i < len; i++) {
			cb(this.array[i], hash[this.array[i]]);
		}
	}

	dump(html) {
		var str = "";

		vha.each(function(name, val) {
			str += "name: " + name + " val: " + JSON.stringify(val) + (html ? "<br>" : "\n");
		});

		return str;
	}
};


export class VertoLiveArray extends VertoHashArray {
	constructor(verto, context, name, config) {
		super();
		this.verto = verto;
		this.lastSerno = 0;
		this.binding = null;
		this.user_obj = config.userObj;
		this.config = config;
		this.local = false;

		// Save the hashArray add, del, reorder, clear methods so we can make our own.
		this._add = super.add;
		this._del = super.del;
		this._reorder = super.reorder;
		this._clear = super.clear;

		this.context = context;
		this.name = name;
		this.errs = 0;
		this.onChange = config.onChange;
		console.log("VertoLiveArray init....");

		if (context) {
			this.binding = verto.subscribe(context, {handler: this.eventHandler.bind(this),
				userData: verto,
				userData: this,
				subParams: config.subParams
			});
		}

		this.bootstrap(config);
	}

	broadcast(channel, obj) {
		console.log("broadcast", obj);
		this.verto.broadcast(channel, obj);
	}

	clear() {
		this._clear();
		this.lastSerno = 0;

		if (this.onChange) {
			this.onChange(this, {
				action: "clear"
			});
		}
	}

	checkSerno(serno) {
		if (serno < 0) {
			return true;
		}

		if (this.lastSerno > 0 && serno != (this.lastSerno + 1)) {
			if (this.onErr) {
				this.onErr(la, {
					lastSerno: this.lastSerno,
					serno: serno
				});
			}
			this.errs++;
			console.debug(this.errs);
			if (this.errs < 3) {
				this.bootstrap(this.user_obj);
			}
			return false;
		} else {
			this.lastSerno = serno;
			return true;
		}
	};

	reorder(serno, a) {
		if (this.checkSerno(serno)) {
			this._reorder(a);
			if (this.onChange) {
				this.onChange(this, {
					serno: serno,
					action: "reorder"
				});
			}
		}
	};

	init(serno, val, key, index) {
		if (key === null || key === undefined) {
			key = serno;
		}
		if (this.checkSerno(serno)) {
			if (la.onChange) {
				la.onChange(la, {
					serno: serno,
					action: "init",
					index: index,
					key: key,
					data: val
				});
			}
		}
	};

	bootObj(serno, val) {
		if (this.checkSerno(serno)) {

			this.clear();
			for (var i in val) {
				this._add(val[i][0], val[i][1]);
			}

			if (this.onChange) {
				this.onChange(this, {
					serno: serno,
					action: "bootObj",
					data: val,
					redraw: true
				});
			}
		}
	}

// 	// @param serno  La is the serial number for la particular request.
// 	// @param key    If looking at it as a hash table, la represents the key in the hashArray object where you want to store the val object.
// 	// @param index  If looking at it as an array, la represents the position in the array where you want to store the val object.
// 	// @param val    La is the object you want to store at the key or index location in the hash table / array.
	add(serno, val, key, index) {
		if (key === null || key === undefined) {
			key = serno;
		}
		if (this.checkSerno(serno)) {
			var redraw = this._add(key, val, index);
			if (this.onChange) {
				this.onChange(this, {
					serno: serno,
					action: "add",
					index: index,
					key: key,
					data: val,
					redraw: redraw
				});
			}
		}
	}

	modify(serno, val, key, index) {
		if (key === null || key === undefined) {
			key = serno;
		}
		if (this.checkSerno(serno)) {
			this._add(key, val, index);
			if (this.onChange) {
				this.onChange(this, {
					serno: serno,
					action: "modify",
					key: key,
					data: val,
					index: index
				});
			}
		}
	}

	del(serno, key, index) {
		if (key === null || key === undefined) {
			key = serno;
		}
		if (this.checkSerno(serno)) {
			if (index === null || index < 0 || index === undefined) {
				index = this.indexOf(key);
			}
			var ok = this._del(key);

			if (ok && this.onChange) {
				this.onChange(this, {
					serno: serno,
					action: "del",
					key: key,
					index: index
				});
			}
		}
	}

	eventHandler(v, e, la) {
		var packet = e.data;

		console.error("READ:", packet);

		if (packet.name != la.name) {
			return;
		}

		switch (packet.action) {

		case "init":
			this.init(packet.wireSerno, packet.data, packet.hashKey, packet.arrIndex);
			break;

		case "bootObj":
			this.bootObj(packet.wireSerno, packet.data);
			break;
		case "add":
			this.add(packet.wireSerno, packet.data, packet.hashKey, packet.arrIndex);
			break;

		case "modify":
			if (! (packet.arrIndex || packet.hashKey)) {
				console.error("Invalid Packet", packet);
			} else {
				this.modify(packet.wireSerno, packet.data, packet.hashKey, packet.arrIndex);
			}
			break;
		case "del":
			if (! (packet.arrIndex || packet.hashKey)) {
				console.error("Invalid Packet", packet);
			} else {
				this.del(packet.wireSerno, packet.hashKey, packet.arrIndex);
			}
			break;

		case "clear":
			this.clear();
			break;

		case "reorder":
			this.reorder(packet.wireSerno, packet.order);
			break;

		default:
			if (this.checkSerno(packet.wireSerno)) {
				if (this.onChange) {
					this.onChange(this, {
						serno: packet.wireSerno,
						action: packet.action,
						data: packet.data
					});
				}
			}
			break;
		}
	}

	destroy() {
		this._clear();
		this.verto.unsubscribe(this.binding);
	}

	sendCommand(cmd, obj) {
		const self = this;
		self.broadcast(self.context, {
			liveArray: {
				command: cmd,
				context: self.context,
				name: self.name,
				obj: obj
			}
		});
	}

	bootstrap(obj) {
		this.sendCommand("bootstrap", obj);
		//this.heartbeat();
	}

	changepage(obj) {
		var self = la;
		self.clear();
		self.broadcast(self.context, {
			liveArray: {
				command: "changepage",
				context: la.context,
				name: la.name,
				obj: obj
			}
		});
	}

	heartbeat(obj) {
		var self = la;

		var callback = function() {
			self.heartbeat.call(self, obj);
		};

		self.broadcast(self.context, {
			liveArray: {
				command: "heartbeat",
				context: self.context,
				name: self.name,
				obj: obj
			}
		});

		self.hb_pid = setTimeout(callback, 30000);
	}
};

// window.VertoLiveArray = VertoLiveArray;
