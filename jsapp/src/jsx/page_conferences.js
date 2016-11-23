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
import { ButtonGroup,  Button } from 'react-bootstrap';

var Member = React.createClass({
	propTypes: {
		onMemberClick: React.PropTypes.func,
	},

	getInitialState: function() {
		return this.props.member;
	},

	// allow the parent to set my state
	componentWillReceiveProps: function(props) {
		// console.log("props", props);
		this.setState(props.member);
	},

	handleClick: function(e) {
		var member_id = e.currentTarget.getAttribute("data-member-id");
		this.state.active = !this.state.active;
		this.setState(this.state);

		this.props.onMemberClick(member_id, this.state.active);
	},

	render: function() {
		var row = this.state;
		var className = this.state.active ? "member active selected" : "member";
		return <tr className={className} data-member-id={row.memberID} onClick={this.handleClick}>
					<td>{row.memberID}</td>
					<td>"{row.cidName}" &lt;{row.cidNumber}&gt;</td>
					<td>{row.status.audio.floor ? "F" : "f"} |
						{row.status.audio.talking ? " T" : " t"} |
						{row.status.audio.deaf ? " D" : " d"} |
						{row.status.audio.muted ? " M" : " m"} |
						{row.status.audio.onHold ? " H" : " h"} |
						{row.status.audio.energyScore}
					</td>
					<td>{row.email}</td>
			</tr>;
	}
});

var ConferencePage = React.createClass({
	la: null,
	activeMembers: {},

	getInitialState: function() {
		return {name: this.props.name, rows: [], la: null};
	},

	getChannelName: function(what) { // liveArray chat mod
		return "conference-" + what + "." + this.props.name + "@" + domain;
	},

	handleControlClick: function(e) {
		var data = e.target.getAttribute("data");
		console.log("data", data);

		if (data == "lock") {
			fsAPI("conference", this.props.name + " lock");
		} else if (data == "unlock") {
			fsAPI("conference", this.props.name + " unlock");
		} else if (data == "select") {
			var rows = [];
			var _this = this;
			if (this.state.rows.length > 0) {
				var active = !this.state.rows[0].active;

				this.state.rows.forEach(function(row) {
					row.active = active;
					rows.push(row);
					console.log("row", row.active);
					_this.activeMembers[row.memberID] = active;
				});
				this.setState({rows: rows});
			}
			return;
		}

		for(var member in this.activeMembers) {
			if (this.activeMembers[member] == true) {
				var args = this.props.name + " " + data + " " + member;
				// console.log("args", args);
				fsAPI("conference", args);
			}
		}
	},

	handleMemberClick: function(member_id, isActive) {
		console.log("member_id", member_id);
		this.activeMembers[member_id] = isActive;
	},

	componentWillMount: function() {
	},

	componentWillUnmount: function() {
		if (this.la) this.la.destroy();
	},

	componentDidMount: function() {
		console.log("name:", this.props.name);
		window.addEventListener("verto-login", this.handleVertoLogin);

		if (verto) {
			this.la = new $.verto.liveArray(verto, this.getChannelName("liveArray"), this.props.name, {});
			this.la.onChange = this.handleConferenceEvent;
		} // else verto is not ready yet, this happends on a refresh, wait for the verto-login event;
	},

	handleVertoLogin: function(e) {
		// console.log("eeee", e.detail);
		if (this.la) this.la.destroy;
		this.la = new $.verto.liveArray(verto, this.getChannelName("liveArray"), this.props.name, {});
		this.la.onChange = this.handleConferenceEvent;
	},

	handleConferenceEvent: function(la, a) {
		// console.log("onChange FSevent:", la);
		console.log("onChange FSevent:", a);

		switch (a.action) {

		case "init":
			break;

		case "bootObj":
			var rows = [];
			a.data.forEach(function(member) {
				rows.push(translateMember(member));
			})
			this.setState({rows: rows});
			break;

		case "add":
			var rows = this.state.rows;
			rows.push(translateMember([a.key, a.data]));
			this.setState({rows: rows});
			break;

		case "modify":
			var rows = [];
			var _this = this;

			this.state.rows = this.state.rows.map(function(row) {
				if (row.uuid == a.key ) {
					var member = translateMember([a.key, a.data]);
					member.active = _this.activeMembers[member.memberID];
					return member;
				} else {
					return row;
				}
			});

			this.setState(this.state);
			break;

		case "del":
			var rows = []

			this.state.rows.forEach(function(row) {
				if (row.uuid != a.key ) rows.push(row);
			});

			this.setState({rows: rows});
			break;

		case "clear":
			this.setState({rows: []});
			break;

		case "reorder":
			break;

		default:
			console.log("unknow action: ", a.action);
			break;
		}
	},

	render: function() {
		var _this = this;

		return <div>
			<div id="conference-controls">
			<ButtonGroup>
				<Button><T.span onClick={this.handleControlClick} text= "Mute" /></Button>
				<Button><T.span onClick={this.handleControlClick} text= "unMute" /></Button>
				<Button><T.span onClick={this.handleControlClick} text= "Hangup" /></Button>
			</ButtonGroup>
			&nbsp;&nbsp;
			<ButtonGroup>
				<Button><T.span onClick={this.handleControlClick} text= "Select" /></Button>
			</ButtonGroup>
			&nbsp;&nbsp;
			<ButtonGroup>
				<Button><T.span onClick={this.handleControlClick} text= "Lock" /></Button>
				<Button><T.span onClick={this.handleControlClick} text= "unLock" /></Button>
			</ButtonGroup>
			</div>
			<h1><T.span text={{ key: "Conference"}} /> {this.props.name}</h1>
			<div>
				<table className="table conference">
				<tbody>
				<tr>
					<th><T.span text="Member ID"/></th>
					<th><T.span text="CID"/></th>
					<th><T.span text="Status"/></th>
					<th><T.span text="Email"/></th>
				</tr>
				{
					this.state.rows.map(function(member) {
						return <Member member={member} key={member.uuid} onMemberClick={_this.handleMemberClick} />
					})
				}
				</tbody>
				</table>
			</div>
		</div>
	}
});

export default ConferencePage;
