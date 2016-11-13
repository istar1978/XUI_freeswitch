'use strict';

var verto;
var host = window.location.hostname;
var domain = host;

var callbacks = {

	onMessage: function(verto, dialog, msg, data) {
		console.log("GOT MSG", msg);

		switch (msg) {
		case $.verto.enum.message.pvtEvent:
			console.error("pvtEvent", data.pvtData);
			break;
		case $.verto.enum.message.display:
			break;
		default:
			break;
		}
	},

	onDialogState: function(d) {
		fire_event("verto-dialog-state", d);
	},

	onWSLogin: function(v, success) {
		console.log("login");
		console.log(v);
		console.log(success);
		verto.subscribe("presence", {
			handler: function(v, e) {
				console.log("PRESENCE:", e);
			}
		});

		fire_event("verto-login", v);

		fsStatus(function(s) {
			// fire a "update-status" event so the OverView component can update
			fire_event("update-status", s);
		});
	},

	onWSClose: function(v, success) {
		console.log("close");
		console.log(v);
		console.log(success);
	},

	onEvent: function(v, e) {
		console.debug("GOT EVENT", e);
	},
};


verto = new $.verto({
		login: "1000" + "@" + host,
		passwd: "1234",
		socketUrl: "wss://" + host + ":8082",
		tag: "webcam",
		audioParams: {
	}
}, callbacks);


$('#ocean_callButton').click(function() {
	options = {
		from_number: $('#number').val(),
		cid_number: $('#number').val()
	};

	makeCall($('#number').val(), options);
});


function makeCall(dest_number, options)
{
	verto.sendMethod("jsapi", {
		command: "cti",
		data: {
			method: "makeCall",
			dest_number: dest_number,
			from_number: options.from_number,
			cid_number: options.cid_number
		}
	});
}

function showFSAPI(what, success_cb, failed_cb)
{
	verto.sendMethod("jsapi", {
		command: "fsapi",
		data: {
			cmd: "show",
			arg: what + " as json"
		},
	}, success_cb, failed_cb);
}

function fsAPI(cmd, arg, success_cb, failed_cb)
{
	verto.sendMethod("jsapi", {
		command: "fsapi",
		data: {
			cmd: cmd,
			arg: arg
		},
	}, success_cb, failed_cb);
}

function fsStatus(success_cb, failed_cb)
{
	verto.sendMethod("jsapi", {
		command: "fsapi",
		data: {
			cmd: "status"
		},
	}, success_cb, failed_cb);
}

function fire_event(event_name, detail, bubbles)
{
	var customEvent = new CustomEvent(event_name,  {
		detail: detail,
		bubbles: bubbles ? bubbles : false
	});

	window.dispatchEvent(customEvent);
}

function jsjson()
{
	verto.sendMethod("jsapi", {
		command: "jsjson",
		data: {
			path: "jsjson/test.js",
			t1: "t1",
			t2: "t2"
		}
	});
}

function lua(dest_number, options)
{
	verto.sendMethod("jsapi", {
		command: "lua",
		data: {
			method: "test",
			func: "test",
			dest_number: dest_number
		}
	});
}

function lua2(dest_number, options)
{
	verto.sendMethod("jsapi", {
		command: "lua",
		data: {
			method: "test",
			func: "test",
			dest_number: dest_number,
			data: {
				a: "aaaa",
				b: "bbbb"
			}
		}
	});
}

function clueconstatus()
{
    verto.sendMethod("jsapi", {
   		command: "status",
    	data: {}
  	}, function(x) {
  		console.log("status", x);
	});
}
