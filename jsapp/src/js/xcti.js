/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2015-2016, Seven Du <dujinfang@x-y-t.cn>
 *
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is XUI - GUI for FreeSWITCH
 *
 * The Initial Developer of the Original Code is
 * Seven Du <dujinfang@x-y-t.cn>
 * Portions created by the Initial Developer are Copyright (C)
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Seven Du <dujinfang@x-y-t.cn>
 *
 *
 */

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
		fire_event("verto-disconnect", v);
	},

	onEvent: function(v, e) {
		console.debug("GOT EVENT", e);
	},

/*
	success_cb: function(a, b) {
	},

	error_cb: function(a, b) {
	}
*/
};


var verto = null;

$(document).ready(function(){
	var protocol = window.location.protocol == "https:" ? "wss://" : "ws://";

	verto = new $.verto({
		login: "1000" + "@" + host,
		passwd: "1234",
		socketUrl: protocol + host + ":" + window.location.port,
		tag: "webcam",
		audioParams: {
		},
		iceServers: [
		// { url: 'stun:[YOUR_STUN_SERVER]',}
		],
		// These can be set per-call as well as per-login.
		deviceParams: {
			useMic: 'any',
			useSpeak: 'any',
		},
	}, callbacks);
});

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

// translate conference member
function translateMember(member) {
	m = {
		'uuid': member[0],
		'memberID': member[1][0],
		'cidNumber': member[1][1],
		'cidName': member[1][2],
		'codec': member[1][3],
		'status': JSON.parse(member[1][4]),
		'email': member[1][5].email,
		'active': false
	};

	// console.log("m", m);
	return m;
}

function form2json (selector) {
	var ary = $(selector).serializeArray();
	var obj = {};
	for (var a = 0; a < ary.length; a++) obj[ary[a].name] = ary[a].value;
	return obj;
}
