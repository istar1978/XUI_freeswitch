'use strict';

import React from 'react';
import verto from './verto/verto';


class VertoPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {rows:[]};
	}

	componentDidMount() {
		var callbacks = {

			onMessage: function(verto, dialog, msg, data) {
				console.log("GOT MSG", msg);

				switch (msg) {
				case Verto.enum.message.pvtEvent:
					console.error("pvtEvent", data.pvtData);
					break;
				case Verto.enum.message.display:
					break;
				default:
					break;
				}
			},

			onDialogState: function(d) {
				fire_event("verto-dialog-state", d);
			},

			onWSLogin: function(v, success) {
				console.log("login", v);
				console.log("login", success);
				verto_loginState = true;

				if (!success) {
					fire_event("verto-login-error", v);
					return;
				}

				document.cookie = "freeswitch_xtra_session_id=" + v.sessid;

				fire_event("verto-login", v);

				verto.fsStatus(function(s) {
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
			}
		};

		// window.verto = Verto;
		verto.connect(verto_params(), callbacks);
	}

	render() {
		return <span></span>
	}
}

export {VertoPage};
