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

import React from 'react';
import T from 'i18n-react';
import verto from './verto/verto';

class ChannelsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {rows: []};

		this.handleFSEvent = this.handleFSEvent.bind(this);
	}

	handleClick (x) {
	}

	componentWillMount () {
	}

	componentWillUnmount () {
		verto.unsubscribe("FSevent.channel_create");
		verto.unsubscribe("FSevent.channel_progress");
		verto.unsubscribe("FSevent.channel_answer");
		verto.unsubscribe("FSevent.channel_hangup");
		// verto.unsubscribe("FSevent");
	}

	componentDidMount () {
		var _this = this;
		verto.showFSAPI("channels", function(data) {
			var msg = $.parseJSON(data.message);
			if (msg.row_count === 0) {
				_this.setState({rows: []});
			} else {
				console.log(msg.rows);
				_this.setState({rows: msg.rows});
			};
		});

		verto.subscribe("FSevent.channel_create", {
			handler: this.handleFSEvent
		});

		verto.subscribe("FSevent.channel_progress", {
			handler: this.handleFSEvent
		});

		verto.subscribe("FSevent.channel_answer", {
			handler: this.handleFSEvent
		});

		verto.subscribe("FSevent.channel_hangup", {
			handler: this.handleFSEvent
		});

		// verto.subscribe("FSevent", {
		// 	handler: _this.handleFSEvent
		// });
	}

	handleFSEvent (v, e) {
		console.log("FSevent:", e);
		if (e.eventChannel == "FSevent.channel_create") {
			var rows = this.state.rows;
			var row = {};
			var date = new Date(parseInt(e.data["Caller-Channel-Created-Time"]) / 1000).toISOString();

			row.uuid = e.data["Unique-ID"];
			row.cid_num = e.data["Caller-Caller-ID-Number"];
			row.dest = e.data["Caller-Destination-Number"];
			row.callstate = e.data["Channel-Call-State"];
			row.direction = e.data["Call-Direction"];
			row.created = date;
			rows.push(row);
			this.setState({rows: rows});
		} else if (e.eventChannel == "FSevent.channel_progress") {
			var rows = [];
			var uuid = e.data["Unique-ID"];

			this.state.rows.forEach(function(row) {
				if (uuid == row.uuid) {
					row.callstate = e.data["Channel-Call-State"];
				}
				rows.push(row);
			});

			this.setState({rows: rows});

		} else if (e.eventChannel == "FSevent.channel_answer") {
			var rows = [];
			var uuid = e.data["Unique-ID"];

			this.state.rows.forEach(function(row) {
				if (uuid == row.uuid) {
					row.callstate = "Active";
				}
				rows.push(row);
			});

			this.setState({rows: rows});
		} else if (e.eventChannel == "FSevent.channel_hangup") {
			let uuid = e.data["Unique-ID"];
			let rows = this.state.rows.filter(function(row) {
				return uuid != row.uuid;
			});

			this.setState({rows: rows});
		}
	}

	render () {
		let rows = this.state.rows.map(function(row) {
			return <tr key={row.uuid}>
				<td>{row.uuid}</td>
				<td>{row.cid_num}</td>
				<td>{row.dest}</td>
				<td>{row.callstate}</td>
				<td>{row.direction}</td>
				<td>{row.created}</td>
			</tr>
		})

		return <div>
			<h1><T.span text="Channels"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="UUID"/></th>
					<th><T.span text="CID Number"/></th>
					<th><T.span text="Dest Number"/></th>
					<th><T.span text="Call State"/></th>
					<th><T.span text="Direction"/></th>
					<th><T.span text="Created"/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

export default ChannelsPage;
