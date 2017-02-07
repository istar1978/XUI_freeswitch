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
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';

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

		console.log('props', this.props);

		if (this.props.displayStyle == 'table') {
			return <tr className={className} data-member-id={row.memberID} onClick={this.handleClick}>
					<td>{row.memberID}</td>
					<td>"{row.cidName}" &lt;{row.cidNumber}&gt;</td>
					<td>{row.status.audio.floor ? "F" : "f"} |&nbsp;
						{row.status.audio.talking ? " T" : " t"} |&nbsp;
						{row.status.audio.deaf ? " D" : " d"} |&nbsp;
						{row.status.audio.muted ? " M" : " m"} |&nbsp;
						{row.status.audio.onHold ? " H" : " h"} |&nbsp;
						{row.status.audio.energyScore}
					</td>
					<td>{row.email}</td>
			</tr>;
		} else if (this.props.displayStyle == 'list') {
			return <li className={className} data-member-id={row.memberID} onClick={this.handleClick}>
				{row.cidNumber}
			</li>
		}
	}
});

var ConferencePage = React.createClass({
	la: null,
	activeMembers: {},

	getInitialState: function() {
		return {name: this.props.name, rows: [], la: null,
			last_outcall_member_id: 0, outcall_rows: [],
			outcallNumber: '', outcallNumberShow: false,
			displayStyle: 'table', toolbarText: false
		};
	},

	getChannelName: function(what) { // liveArray chat mod
		return "conference-" + what + "." + this.props.name + "@" + domain;
	},

	handleOutcallNumberChange: function(e) {
		this.setState({outcallNumber: e.target.value});
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
		} else if (data == "call") {
			if (!this.state.outcallNumberShow) {
				this.setState({outcallNumberShow: true});
				this.outcallNumberInput.focus();
				return;
			}

			if (this.state.outcallNumber == '') {
				// this.outcallNumberInput.focus();
				this.setState({outcallNumberShow: false});
				return;
			}

			this.state.last_outcall_member_id--;

			let member = {
				uuid: this.state.last_outcall_member_id,
				memberID: this.state.last_outcall_member_id,
				cidNumber: this.state.outcallNumber,
				cidName: this.state.outcallNumber,
				codec: null,
				status: {audio: {energyScore: 'Calling ...'}, video: {}},
				email: null,
				active: false
			};

			let rows = this.state.outcall_rows;
			rows.unshift(member);
			this.setState({outcall_rows: rows});

			// fsAPI("bgapi", "conference " + this.state.name + " dial user/1007");

			$.ajax({
				type: "POST",
				url: "/api/conferences/" + this.state.name,
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({
					from: member.cidNumber,
					to: member.cidNumber}),
				success: function (obj) {
				},
				error: function(msg) {
					console.error("err call", msg);
				}
			});
		} else if (data == "toolbarText") {
			this.setState({toolbarText: !this.state.toolbarText});
		} else {
			this.setState({displayStyle: data});
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
			var found = 0;
			var member = translateMember([a.key, a.data]);

			if (member.cidName == "Outbound Call") {
				var outcall_rows = this.state.outcall_rows.filter(function(row) {
					if (row.cidNumber == member.cidNumber) {
						found++;
						return false;
					} else {
						return true;
					}
				});

				if (found) this.setState({outcall_rows: outcall_rows});
			}

			var rows = this.state.rows;
			rows.push(member);
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
			var rows = this.state.rows.filter(function(row) {
				return row.uuid != a.key;
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

		const rows = this.state.outcall_rows.concat(this.state.rows);

		const members = rows.map(function(member) {
			return <Member member={member} key={member.uuid} onMemberClick={_this.handleMemberClick} displayStyle={_this.state.displayStyle}/>
		});

		let member_list;

		if (this.state.displayStyle == 'table') {
			member_list = <table className="table conference">
				<tbody>
				<tr>
					<th><T.span text="Member ID"/></th>
					<th><T.span text="CID"/></th>
					<th><T.span text="Status"/></th>
					<th><T.span text="Email"/></th>
				</tr>
				{members}
				</tbody>
			</table>
		} else if (this.state.displayStyle == 'list') {
			member_list = <ul>{members}</ul>
		}

		const toolbarTextStyle = this.state.toolbarText ? null : {display: 'none'};

		return <div>
			<ButtonToolbar className="pull-right">

			<ButtonGroup style={ this.state.outcallNumberShow ? null : {display: 'none'} }>
				<input value={this.state.outcallNumber} onChange={this.handleOutcallNumberChange} size={10}
					ref={(input) => { this.outcallNumberInput = input; }} placeholder="number"/>
			</ButtonGroup>


			<ButtonGroup>
				<Button onClick={this.handleControlClick} data="call">
					<i className="fa fa-phone" aria-hidden="true" data="call"></i>&nbsp;
					<T.span text= "Call" data="call" style={toolbarTextStyle}/>
				</Button>
			</ButtonGroup>

			<ButtonGroup>
				<Button onClick={this.handleControlClick} data="select">
					<i className="fa fa-check-square-o" aria-hidden="true" data="select"></i>&nbsp;
					<T.span text= "Select" data="select" style={toolbarTextStyle}/>
				</Button>
			</ButtonGroup>

			<ButtonGroup>
				<Button onClick={this.handleControlClick} data="mute">
					<i className="fa fa-microphone-slash" aria-hidden="true" data="mute"></i>&nbsp;
					<T.span text= "Mute" data="mute"  style={toolbarTextStyle}/>
				</Button>
				<Button onClick={this.handleControlClick} data="unmute">
					<i className="fa fa-microphone" aria-hidden="true" data="unmute"></i>&nbsp;
					<T.span text= "unMute" data="unmute" style={toolbarTextStyle}/>
				</Button>
				<Button onClick={this.handleControlClick} data="hup">
					<i className="fa fa-power-off" aria-hidden="true" data="hup"></i>&nbsp;
					<T.span text= "Hangup" data="hup" style={toolbarTextStyle}/>
				</Button>
			</ButtonGroup>

			<ButtonGroup>
				<Button onClick={this.handleControlClick} data="lock">
					<i className="fa fa-lock" aria-hidden="true" data="lock"></i>&nbsp;
					<T.span text= "Lock" data="lock" style={toolbarTextStyle}/>
				</Button>
				<Button onClick={this.handleControlClick} data="unlock">
					<i className="fa fa-unlock-alt" aria-hidden="true" data="unlock"></i>&nbsp;
					<T.span text= "unLock" data="unlock" style={toolbarTextStyle}/>
				</Button>
			</ButtonGroup>

			<ButtonGroup>
				<Button>
					<T.span onClick={this.handleControlClick} text= "T" data="table"/>
				</Button>
				<Button>
					<T.span onClick={this.handleControlClick} text= "=" data="list"/>
				</Button>
				<Button>
					<T.span onClick={this.handleControlClick} text= "T" data="toolbarText"/>
				</Button>
			</ButtonGroup>


			</ButtonToolbar>

			<h1><T.span text={{ key: "Conference"}} /><small>{this.props.name}</small></h1>

			<div>
				{member_list}
			</div>
		</div>
	}
});

export default ConferencePage;
