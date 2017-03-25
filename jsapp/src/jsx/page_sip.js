/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2015-2017, Seven Du <dujinfang@x-y-t.cn>
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
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Radio, Col } from 'react-bootstrap';
import { Link } from 'react-router';
// http://kaivi.github.io/riek/
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek'
import { EditControl } from './xtools'
import verto from './verto/verto';

class NewSIPProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {errmsg: ''};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var profile = form2json('#newSIPProfileForm');

		if (!profile.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/sip_profiles",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(profile),
			success: function (obj) {
				profile.id = obj.id;
				_this.props.handleSIPProfileAdded(profile);
			},
			error: function(msg) {
				console.error("sip_profile", msg);
				_this.setState({errmsg: '[' + msg.status + '] ' + msg.statusText});
			}
		});
	}

	render() {
		console.log(this.props);

		const props = Object.assign({}, this.props);
		const profiles = props.profiles;
		delete props.profiles;
		delete props.handleSIPProfileAdded;

		const profiles_options = profiles.map(profile => {
			return <option value={profile.id} key={profile.id}>Profile[{profile.name}]</option>
		});

		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New SIP Profile" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newSIPProfileForm">
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="name" placeholder="profile1" /></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description"/></Col>
					<Col sm={10}><FormControl type="input" name="description" placeholder="Description ..." /></Col>
				</FormGroup>

				<FormGroup controlId="formTemplate">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Template"/></Col>
					<Col sm={10}>
						<FormControl componentClass="select" name="template">
							<option value="default">Default</option>
							{profiles_options}
						</FormControl>
					</Col>
				</FormGroup>

				<FormGroup>
					<Col smOffset={2} sm={10}>
						<Button type="button" bsStyle="primary" onClick={this.handleSubmit}>
							<i className="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;
							<T.span text="Save" />
						</Button>
						&nbsp;&nbsp;<T.span className="danger" text={this.state.errmsg}/>
					</Col>
				</FormGroup>
			</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={this.props.onHide}>
					<i className="fa fa-times" aria-hidden="true"></i>&nbsp;
					<T.span text="Close" />
				</Button>
			</Modal.Footer>
		</Modal>;
	}
}

class SIPProfilePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {profile: {}, edit: false, params:[], order: 'ASC', running: false};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleToggleParam = this.handleToggleParam.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.toggleHighlight = this.toggleHighlight.bind(this);
		this.handleSort = this.handleSort.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var profile = form2json('#newSIPProfileForm');

		if (!profile.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "PUT",
			url: "/api/sip_profiles/" + profile.id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(profile),
			success: function () {
				_this.setState({profile: profile, edit:false});
				notify(<T.span text={{key:"Saved at", time: Date()}}/>);
			},
			error: function(msg) {
				console.error("route", msg);
			}
		});
	}

	handleControlClick(e) {
		this.setState({edit: !this.state.edit});
	}

	handleToggleParam(e) {
		const _this = this;
		const data = e.target.getAttribute("data");

		$.ajax({
			type: "PUT",
			url: "/api/sip_profiles/" + this.state.profile.id + "/params/" + data,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({action: "toggle"}),
			success: function (param) {
				// console.log("success!!!!", param);
				const params = _this.state.params.map(function(p) {
					if (p.id == data) {
						p.disabled = param.disabled;
					}
					return p;
				});
				_this.setState({params: params});
			},
			error: function(msg) {
				console.error("toggle params", msg);
			}
		});
	}

	handleChange(obj) {
		const _this = this;
		const id = Object.keys(obj)[0];

		console.log("change", obj);

		$.ajax({
			type: "PUT",
			url: "/api/sip_profiles/" + this.state.profile.id + "/params/" + id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({v: obj[id]}),
			success: function (obj) {
				console.log("success!!!!", obj);
				const params = _this.state.profile.params.map(function(p) {
					if (p.id == id) {
						return obj;
					}
					return p;
				});
				_this.setState({params: params});
			},
			error: function(msg) {
				console.error("update params", msg);
			}
		});
	}

	toggleHighlight() {
		this.setState({highlight: !this.state.highlight});
	}

	isStringAcceptable() {
		return true;
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/sip_profiles/" + this.props.params.id, "", function(data) {
			_this.setState({profile: data, params: data.params});
			verto.fsAPI("sofia", "xmlstatus", function(data) {
				var msg = $(data.message);
				msg.find("profile").each(function() {
					var profile = this;
					var name = $(profile).find("name").text();
					if(_this.state.profile.name == name){
						_this.setState({running: true});
					}
				});
			});
		}, function(e) {
			console.log("get profile/sip_profiles ERR");
		});
		verto.subscribe("FSevent.custom::sofia::profile_start", {
			handler: this.handleFSEvent.bind(this)
		});
		verto.subscribe("FSevent.custom::sofia::profile_stop", {
			handler: this.handleFSEvent.bind(this)
		});
	}

	componentWillUnmount() {
		verto.unsubscribe("FSevent.custom::sofia::profile_start");
		verto.unsubscribe("FSevent.custom::sofia::profile_stop");
	}

	handleFSEvent(v, e) {
		const _this = this;
		if (e.eventChannel == "FSevent.custom::sofia::profile_start") {
			const profile_name = e.data["profile_name"];
			console.log("profile_name",profile_name);
			if(_this.state.profile.name == profile_name) {
				_this.setState({ running : true});
			}
		} else if (e.eventChannel == "FSevent.custom::sofia::profile_stop") {
			const profile_name = e.data["profile_name"];
			if (_this.state.profile.name == profile_name) {
				_this.setState({ running : false});
			}
		}
	}

	handleStart(e){
		verto.fsAPI("sofia", "profile " + this.state.profile.name + " start");
	}

	handleStop(e){
		const _this = this;
		let name = this.state.profile.name;
		verto.fsAPI("sofia", "profile " + name + " stop", function(ret) {
			if (ret.message.match("stopping:")) {
				// trick FS has no sofia::profile_stop event
				var evt = {}
				evt.eventChannel = "FSevent.custom::sofia::profile_stop";
				evt.data = {profile_name: name}
				_this.handleFSEvent(verto, evt);
			} else {
				notify(ret.message);
			}
		});
	}

	handleRestart(e){
		const _this = this;
		let name = this.state.profile.name;
		verto.fsAPI("sofia", "profile " + name + " restart", function(ret) {
			if (ret.message.match("restarting:")) {
				notify("restarting profile ...");
			} else {
				notify(ret.message);
			}
		});
	}

	handleRescan(e){
		verto.fsAPI("sofia", "profile " + this.state.profile.name + " rescan", function(ret) {
			notify(ret.message);
		});
	}


	handleSort(e){
		const profile = this.state.profile;
		var params = this.state.params;
		var field = e.target.getAttribute('data');
		var n = 1;

		if (this.state.order == 'ASC') {
			this.state.order = 'DSC';
			n = -1;
		} else {
			this.state.order = 'ASC';
		}

		params.sort(function(a,b) {
			return a[field].toUpperCase() < b[field].toUpperCase() ? -1 * n : 1 * n;
		});
		this.setState({profile: profile});
	}

	render() {
		const profile = this.state.profile;
		const _this = this;
		let save_btn = "";
		let err_msg = "";
		let params = <tr></tr>;
		let color = this.state.running ? "lime" : '#dadada';
		const running_state = {
			background : color,
		} 

		if (this.state.params && Array.isArray(this.state.params)) {
			// console.log(this.state.profile.params)
			params = this.state.params.map(function(param) {
				const enabled_style = dbfalse(param.disabled) ? "success" : "default";
				const disabled_class = dbfalse(param.disabled) ? null : "disabled";

				return <tr key={param.id} className={disabled_class}>
					<td>{param.k}</td>
					<td><RIEInput value={_this.state.highlight ? (param.v ? param.v : T.translate("Click to Change")) : param.v} change={_this.handleChange}
						propName={param.id}
						className={_this.state.highlight ? "editable" : ""}
						validate={_this.isStringAcceptable}
						classLoading="loading"
						classInvalid="invalid"/>
					</td>
					<td style={{textAlign: "right", paddingRight: 0}}>
						<Button onClick={_this.handleToggleParam} data={param.id} bsStyle={enabled_style}>
							{dbfalse(param.disabled) ? T.translate("Yes") : T.translate("No")}
						</Button>
					</td>
				</tr>
			});
		}

		if (this.state.edit) {
			save_btn = <Button onClick={this.handleSubmit}><T.span text="Save"/></Button>
		}

		return <div>
			<ButtonToolbar className="pull-right">
			<ButtonGroup className="block">
				<div style={running_state}></div>
			</ButtonGroup>
			<ButtonGroup>
				<Button onClick={_this.handleStart.bind(_this)}><i className="fa fa-play" aria-hidden="true"></i>&nbsp;<T.span text="Start"/></Button>
				<Button onClick={_this.handleStop.bind(_this)}><i className="fa fa-pause" aria-hidden="true"></i>&nbsp;<T.span text="Stop"/></Button>
				<Button onClick={_this.handleRestart.bind(_this)}><i className="fa fa-forward" aria-hidden="true"></i>&nbsp;<T.span text="Restart"/></Button>
				<Button onClick={_this.handleRescan.bind(_this)}><i className="fa fa-search" aria-hidden="true"></i>&nbsp;<T.span text="Rescan"/></Button>
			</ButtonGroup>
			<ButtonGroup>
				{ save_btn }
				<Button onClick={this.handleControlClick}><i className="fa fa-edit" aria-hidden="true"></i>&nbsp;<T.span text="Edit"/></Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h1>Profile <small style={running_state}>{profile.name}</small></h1>
			<hr/>


			<Form horizontal id="newSIPProfileForm">
				<input type="hidden" name="id" defaultValue={profile.id}/>
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="name" defaultValue={profile.name}/></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="description" defaultValue={profile.description}/></Col>
				</FormGroup>

				<FormGroup controlId="formSave">
					<Col componentClass={ControlLabel} sm={2}></Col>
					<Col sm={10}>{save_btn}</Col>
				</FormGroup>
			</Form>

			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				<Button onClick={this.toggleHighlight}><i className="fa fa-edit" aria-hidden="true"></i>&nbsp;<T.span text="Edit"/></Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h2><T.span text="Params"/></h2>
			<table className="table">
				<tbody>
				<tr>
					<th style={{cursor: "pointer"}} onClick={this.handleSort.bind(this)} data="k"><T.span text="Name" data="k"/></th>
					<th><T.span text="Value"/></th>
					<th style={{textAlign: "right", paddingRight: 0, cursor: "pointer"}} onClick={this.handleSort.bind(this)} data="disabled"><T.span text="Enabled" data="disabled"/></th>
				</tr>
				{params}
				</tbody>
			</table>
		</div>
	}
}

class SIPProfilesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { formShow: false, rows: [], danger: false, profileDetails: {}};

		// This binding is necessary to make `this` work in the callback
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleControlClick(e) {
		var data = e.target.getAttribute("data");
		console.log("data", data);

		if (data == "new") {
			this.setState({ formShow: true});
		}
	}

	handleDelete(e) {
		e.preventDefault();

		var id = e.target.getAttribute("data-id");
		console.log("deleting id", id);
		var _this = this;

		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));

			if (!c) return;
		}

		$.ajax({
			type: "DELETE",
			url: "/api/sip_profiles/" + id,
			success: function () {
				console.log("deleted")
				var rows = _this.state.rows.filter(function(row) {
					return row.id != id;
				});

				_this.setState({rows: rows});
			},
			error: function(msg) {
				console.error("route", msg);
			}
		});
	}

	handleClick(x) {
	}

	componentWillMount() {
	}

	componentWillUnmount() {
		verto.unsubscribe("FSevent.custom::sofia::profile_start");
		verto.unsubscribe("FSevent.custom::sofia::profile_stop");
	}

	syncSofiaStatus() {
		var _this = this;
		$.getJSON("/api/sip_profiles", "", function(data) {
			_this.setState({rows: data});

			verto.fsAPI("sofia", "xmlstatus", function(data) {
				var rows = _this.state.rows;
				var msg = $(data.message);

				msg.find("profile").each(function() {
					var profile = this;
					var name = $(profile).find("name").text();

					rows = rows.map(function(row) {
						if (row.name == name) row.running = true;
						return row;
					});
				});

				_this.setState({rows: rows});
			});
		}, function(e) {
			console.log("get sip_profiles ERR");
		});
	}

	componentDidMount() {
		verto.subscribe("FSevent.custom::sofia::profile_start", {
			handler: this.handleFSEvent.bind(this)
		});

		verto.subscribe("FSevent.custom::sofia::profile_stop", {
			handler: this.handleFSEvent.bind(this)
		});

		this.syncSofiaStatus();
	}

	handleFSEvent(v, e) {
		const _this = this;

		if (e.eventChannel == "FSevent.custom::sofia::profile_start") {
			const profile_name = e.data["profile_name"];

			const rows = _this.state.rows.map(function(row) {
				if (row.name == profile_name) {
					row.running = true;
				}
				return row;
			});

			_this.setState({rows: rows});
		} else if (e.eventChannel == "FSevent.custom::sofia::profile_stop") {
			const profile_name = e.data["profile_name"];

			const rows = _this.state.rows.map(function(row) {
				if (row.name == profile_name) {
					row.running = false;
				}
				return row;
			});

			_this.setState({rows: rows});
		}
	}

	handleSIPProfileAdded(route) {
		var rows = this.state.rows;
		rows.unshift(route);
		this.setState({rows: rows, formShow: false});
	}

	handleStart(e) {
		e.preventDefault();

		let name = e.target.getAttribute("data-name");
		verto.fsAPI("sofia", "profile " + name + " start");
	}

	handleStop(e) {
		e.preventDefault();
		const _this = this;

		let name = e.target.getAttribute("data-name");
		verto.fsAPI("sofia", "profile " + name + " stop", function(ret) {
			if (ret.message.match("stopping:")) {
				// trick FS has no sofia::profile_stop event
				var evt = {}
				evt.eventChannel = "FSevent.custom::sofia::profile_stop";
				evt.data = {profile_name: name}
				_this.handleFSEvent(verto, evt);
			} else {
				notify(ret.message);
			}
		});
	}

	handleRestart(e) {
		e.preventDefault();
		const _this = this;

		let name = e.target.getAttribute("data-name");
		verto.fsAPI("sofia", "profile " + name + " restart", function(ret) {
			if (ret.message.match("restarting:")) {
				notify("restarting profile ...");
			} else {
				notify(ret.message);
			}
		});
	}

	handleRescan(e) {
		e.preventDefault();

		let name = e.target.getAttribute("data-name");
		verto.fsAPI("sofia", "profile " + name + " rescan", function(ret) {
			notify(ret.message);
		});
	}

	handleMore(e) {
		e.preventDefault();

		this.syncSofiaStatus();

		var _this = this;
		var profile_name = e.target.getAttribute("data-name");

		if (this.state.profileDetails.name) {
			this.setState({profileDetails: {name: undefined}});
			return;
		}

		verto.fsAPI("sofia", "xmlstatus profile " + profile_name, function(data) {
			if (!data.message.match('<')) {
				console.log(data);
				notify(data.message, 'error');
				return;
			}

			var msg = $(data.message);
			var profile = msg[2];
			var info = profile.firstElementChild.firstElementChild;

			var rows = [];

			rows.push({k: info.localName, v: info.innerText});

			while(info = info.nextElementSibling) {
				rows.push({k: info.localName, v: info.innerText});
			}

			_this.setState({profileDetails: {name: profile_name, rows: rows}});
		});
	}

	HandleToggleProfile(e) {
		const profile_id = e.target.getAttribute("data");
		const _this = this;

		$.ajax({
			type: "PUT",
			url: "/api/sip_profiles/" + profile_id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({action: 'toggle'}),
			success: function (profile) {
				const rows = _this.state.rows.map(function(row) {
					if (row.id == profile.id) row.disabled = profile.disabled;
					return row;
				});

				_this.setState({rows: rows});
			},
			error: function(msg) {
				console.error("sip_profile", msg);
			}
		});
	}

	render() {
		const formClose = () => this.setState({ formShow: false });
		const toggleDanger = () => this.setState({ danger: !this.state.danger });
	    const danger = this.state.danger ? "danger" : "";

		const _this = this;

		let rows = [];
		let hand = { cursor: "pointer" };


		this.state.rows.forEach(function(row) {
			const disabled_class = dbfalse(row.disabled) ? "" : "disabled";
			const enabled_style = dbfalse(row.disabled) ? "success" : "default";
			const running_class = row.running ? "running" : null;

			rows.push(<tr key={row.id} className={disabled_class}>
					<td>{row.id}</td>
					<td><Link to={`/settings/sip_profiles/${row.id}`}>{row.name}</Link></td>
					<td>{row.description}</td>
					<td><Button onClick={_this.HandleToggleProfile.bind(_this)} bsStyle={enabled_style} data={row.id}>{dbfalse(row.disabled) ? T.translate("Yes") : T.translate("No")}</Button></td>
					<td className={running_class}>
						<T.a onClick={_this.handleStart} data-name={row.name} text="Start" href='#'/> |&nbsp;
						<T.a onClick={_this.handleStop.bind(_this)} data-name={row.name} text="Stop" href='#'/> |&nbsp;
						<T.a onClick={_this.handleRestart.bind(_this)} data-name={row.name} text="Restart" href='#'/> |&nbsp;
						<T.a onClick={_this.handleRescan.bind(_this)} data-name={row.name} text="Rescan" href='#'/> |&nbsp;
						<T.a onClick={_this.handleMore.bind(_this)} data-name={row.name} text="More" href='#'/>...
					</td>
					<td><T.a onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger} href='#'/></td>
			</tr>);

			if (_this.state.profileDetails.name == row.name) {
				var profile_params = [];
				var profiles;

				_this.state.profileDetails.rows.forEach(function(p) {
					profile_params.push(<li key={p.k}>{p.k}: {p.v}</li>);
				})

				profiles = <ul>{profile_params}</ul>

				rows.push(<tr key={row.name + '+' + row.type + '-profile-details'}>
					<td colSpan={6}>{profiles}</td>
				</tr>);
			}
		})

		return <div>
			<ButtonToolbar className="pull-right">
				<Button onClick={this.handleControlClick} data="new">
					<i className="fa fa-plus" aria-hidden="true" onClick={this.handleControlClick} data="new"></i>&nbsp;
					<T.span onClick={this.handleControlClick} data="new" text="New" />
				</Button>
			</ButtonToolbar>

			<h1><T.span text="SIP Profiles"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Name"/></th>
					<th><T.span text="Description"/></th>
					<th><T.span text="Enabled"/></th>
					<th><T.span text="Status"/> / <T.span text="Control"/></th>
					<th><T.span style={hand} text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>

			<NewSIPProfile show={this.state.formShow} onHide={formClose}
				profiles = {this.state.rows}
				handleSIPProfileAdded={this.handleSIPProfileAdded.bind(this)}/>
		</div>
	}
}

export {SIPProfilesPage, SIPProfilePage};
