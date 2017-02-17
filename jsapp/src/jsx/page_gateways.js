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
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Radio, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek'
import { EditControl } from './xtools'

class NewGateway extends React.Component {
	constructor(props) {
		super(props);

		this.state = {errmsg: ''};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var gw = form2json('#newGatewayForm');
		console.log("gw", gw);

		if (!gw.name || !gw.realm) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/gateways",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(gw),
			success: function (obj) {
				gw.id = obj.id;
				_this.props.handleNewGatewayAdded(gw);
			},
			error: function(msg) {
				console.error("gateway", msg);
			}
		});
	}

	render() {
		console.log(this.props);

		const props = Object.assign({}, this.props);
		const gateways = props.gateways;
		delete props.gateways;
		delete props.handleNewGatewayAdded;

		const gateways_options = gateways.map(gw => {
			return <option value={gw.id} key={gw.id}>Gateway[{gw.name}]</option>
		});

		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New Gateway" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newGatewayForm">
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="name" placeholder="gw1" /></Col>
				</FormGroup>

				<FormGroup controlId="formRealm">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Server" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="realm" placeholder="example.com" /></Col>
				</FormGroup>

				<FormGroup controlId="formUsername">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Username" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="username" placeholder="username" /></Col>
				</FormGroup>

				<FormGroup controlId="formPassword">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Password" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="password" name="password" placeholder="a$veryComplicated-Passw0rd" /></Col>
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
							{gateways_options}
						</FormControl>
					</Col>
				</FormGroup>

				<FormGroup controlId="formRegister">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Register"/></Col>
					<Col sm={10}>
						<Radio name="register" value="yes" inline><T.span text="yes"/></Radio>
						<Radio name="register" value="no" inline><T.span text="no"/></Radio>
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

class GatewayPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {errmsg: '', gw: {}, edit: false, params:[]};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.toggleHighlight = this.toggleHighlight.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleToggleParam = this.handleToggleParam.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var gw = form2json('#newGatewayForm');
		console.log("gw", gw);

		if (!gw.realm || !gw.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "PUT",
			url: "/api/gateways/" + gw.id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(gw),
			success: function () {
				notify(<T.span text={{key:"Saved at", time: Date()}}/>);
				_this.setState({gw: gw, edit: false})
			},
			error: function(msg) {
				console.error("route", msg);
			}
		});
	}

	handleControlClick(e) {
		this.setState({edit: !this.state.edit});
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/gateways/" + this.props.params.id, "", function(data) {
			// console.log("gw", data);
			const params = data.params;
			delete data.params;
			_this.setState({gw: data, params: params});
		}, function(e) {
			console.log("get gw ERR");
		});
	}

	handleSort(e){
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

		this.setState({params: params});
	}

	toggleHighlight() {
		this.setState({highlight: !this.state.highlight});
	}

	isStringAcceptable() {
		return true;
	}

	handleChange(obj) {
		const _this = this;
		const id = Object.keys(obj)[0];

		console.log("change", obj);

		$.ajax({
			type: "PUT",
			url: "/api/gateways/" + this.state.gw.id + "/params/" + id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({v: obj[id]}),
			success: function (param) {
				console.log("success!!!!", param);
				_this.state.params = _this.state.params.map(function(p) {
					if (p.id == id) {
						return param;
					}
					return p;
				});
				_this.setState({params: _this.state.params});
			},
			error: function(msg) {
				console.error("update params", msg);
			}
		});
	}

	handleToggleParam(e) {
		const _this = this;
		const data = e.target.getAttribute("data");

		$.ajax({
			type: "PUT",
			url: "/api/gateways/" + this.state.gw.id + "/params/" + data,
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

	render() {
		const gw = this.state.gw;
		const _this = this; 
		let params = <tr></tr>;
		let save_btn = "";
		let register = gw.register == "yes" ? "yes" : "no";

		register = <FormControl.Static><T.span text={register}/></FormControl.Static>

		if (this.state.params && Array.isArray(this.state.params)) {
			params = this.state.params.map(function(param) {
				const enabled_style = dbfalse(param.disabled) ? "success" : "default";
				const disabled_class = dbfalse(param.disabled) ? null : "disabled";

				return <tr key={param.id} className={disabled_class}>
					<td>{param.k}</td>
					<td><RIEInput value={param.v} change={_this.handleChange}
						propName={param.id}
						className={_this.state.highlight ? "editable" : ""}
						validate={_this.isStringAcceptable}
						classLoading="loading"
						classInvalid="invalid"/>
					</td>
					<td>
						<Button onClick={_this.handleToggleParam} data={param.id} bsStyle={enabled_style}>
							{dbfalse(param.disabled) ? T.translate("Yes") : T.translate("No")}
						</Button>
					</td>
				</tr>
			});
		}

		if (this.state.edit) {
			save_btn = <Button onClick={this.handleSubmit}><T.span onClick={this.handleSubmit} text="Save"/></Button>

			if (gw.register == "yes") {
				register = <span>
					<Radio name="register" value="yes" inline defaultChecked><T.span text="yes"/></Radio>
					<Radio name="register" value="no" inline><T.span text="no"/></Radio>
				</span>
			} else {
				register = <span>
					<Radio name="register" value="yes" inline><T.span text="yes"/></Radio>
					<Radio name="register" value="no" inline defaultChecked><T.span text="no"/></Radio>
				</span>
			}
		}

		return <div>
			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				{ save_btn }
				<Button onClick={this.handleControlClick}><T.span onClick={this.handleControlClick} text="Edit"/></Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h1><T.span text="Gateway"/><small>{gw.name} {gw.username}</small></h1>
			<hr/>

			<Form horizontal id="newGatewayForm">
				<input type="hidden" name="id" defaultValue={gw.id}/>
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="name" defaultValue={gw.name}/></Col>
				</FormGroup>

				<FormGroup controlId="formRealm">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Realm" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="realm" defaultValue={gw.realm}/></Col>
				</FormGroup>

				<FormGroup controlId="formUsername">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Username" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="username" defaultValue={gw.username}/></Col>
				</FormGroup>

				<FormGroup controlId="formPassword">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Password" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="password" defaultValue={gw.password} type="password"/></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="description" defaultValue={gw.description}/></Col>
				</FormGroup>

				<FormGroup controlId="formRegister">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Register" /> ?</Col>
					<Col sm={10}>{register}</Col>
				</FormGroup>

				<FormGroup controlId="formSave">
					<Col componentClass={ControlLabel} sm={2}></Col>
					<Col sm={10}>{save_btn}</Col>
				</FormGroup>
			</Form>

			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				<Button onClick={this.toggleHighlight}><T.span onClick={this.toggleHighlight} text="Edit"/></Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h2><T.span text="Params"/></h2>
			<table className="table">
				<tbody>
				<tr>
					<th onClick={this.handleSort.bind(this)} data="d"><T.span text="Name" data="k"/></th>
					<th><T.span text="Value"/></th>
					<th onClick={this.handleSort.bind(this)} data='disabled'><T.span text="Enabled" data="disabled"/></th>
				</tr>
				{params}
				</tbody>
			</table>
		</div>
	}
}

class GatewaysPage extends React.Component {
	constructor(props) {
		super(props);
		this.gwstatus = {};
		this.state = { formShow: false, rows: [], danger: false};

		// This binding is necessary to make `this` work in the callback
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleFSEvent = this.handleFSEvent.bind(this);
	}

	handleControlClick(e) {
		var data = e.target.getAttribute("data");
		console.log("data", data);

		if (data == "new") {
			this.setState({ formShow: true});
		}
	}

	handleDelete(e) {
		var id = e.target.getAttribute("data-id");
		console.log("deleting id", id);
		var _this = this;

		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));

			if (!c) return;
		}

		$.ajax({
			type: "DELETE",
			url: "/api/gateways/" + id,
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
		verto.unsubscribe("FSevent.custom::sofia::gateway_delete");
		verto.unsubscribe("FSevent.custom::sofia::gateway_add");
		verto.unsubscribe("FSevent.custom::sofia::gateway_state");
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/gateways", "", function(data) {
			_this.setState({rows: data.map(function(row) {
				row.class_name = _this.gwstatus[row.name] ? _this.gwstatus[row.name] : 'NONE';
				return row;
			})});
		}, function(e) {
			console.log("get gateways ERR");
		});

		verto.subscribe("FSevent.custom::sofia::gateway_delete", {handler: this.handleFSEvent});
		verto.subscribe("FSevent.custom::sofia::gateway_add", {handler: this.handleFSEvent});
		verto.subscribe("FSevent.custom::sofia::gateway_state", {handler: this.handleFSEvent});

		fsAPI("sofia", "xmlstatus", function(data) {
			let msg = $(data.message);

			msg.find("gateway").each(function() {
				let gw = this;
				_this.gwstatus[$(gw).find("name").text()] = $(gw).find("state").text();
			});

			let rows = _this.state.rows.map(function(row) {
				row.class_name = _this.gwstatus[row.name];
				console.log('class_name', class_name);
				return row;
			});

			_this.setState({rows: rows});
		});

	}

	handleFSEvent(v, e) {
		console.log('FSevent', e);
		let class_name = "";

		if (e.eventChannel == "FSevent.custom::sofia::gateway_add") {
			console.log("gateway_add", e.data.Gateway);
			class_name = "NOREG"
		} else if (e.eventChannel == "FSevent.custom::sofia::gateway_delete") {
			console.log("gateway_delete", e.data.Gateway);
			class_name = "NONE"
		} else if (e.eventChannel == "FSevent.custom::sofia::gateway_state") {
			class_name = e.data.State;
		}

		let rows = this.state.rows.map(function(row) {
			if (row.name == e.data.Gateway) {
				row.class_name = class_name;
			}
			return row;
		});

		this.setState({rows: rows});
	}

	handleReg(e) {
		e.preventDefault();

		let name = e.target.getAttribute("data-name");
		fsAPI("sofia", "profile public register " + name);
	}

	handleUnreg(e) {
		e.preventDefault();

		let name = e.target.getAttribute("data-name");
		fsAPI("sofia", "profile public unregister " + name);
	}

	handleStart(e) {
		e.preventDefault();

		let name = e.target.getAttribute("data-name");
		fsAPI("sofia", "profile public startgw " + name);
		fsAPI("sofia", "profile public rescan");
	}

	handleStop(e) {
		e.preventDefault();

		let name = e.target.getAttribute("data-name");
		fsAPI("sofia", "profile public killgw " + name);
	}

	handleGatewayAdded(route) {
		var rows = this.state.rows;
		rows.unshift(route);
		this.setState({rows: rows, formShow: false});
	}

	render() {
		let formClose = () => this.setState({ formShow: false });
		let toggleDanger = () => this.setState({ danger: !this.state.danger });
		let hand = { cursor: "pointer"};
	    var danger = this.state.danger ? "danger" : "";

		var _this = this;

		var rows = this.state.rows.map(function(row) {
			return <tr key={row.id} className={row.class_name}>
					<td>{row.id}</td>
					<td><Link to={`/settings/gateways/${row.id}`}>{row.name}</Link></td>
					<td>{row.realm}</td>
					<td>{row.username}</td>
					<td><T.span text={row.register}/></td>
					<td>
						<T.a onClick={_this.handleReg} data-name={row.name} text="Reg" href='#'/> |&nbsp;
						<T.a onClick={_this.handleUnreg} data-name={row.name} text="Unreg" href='#'/> |&nbsp;
						<T.a onClick={_this.handleStart} data-name={row.name} text="Start" href='#'/> |&nbsp;
						<T.a onClick={_this.handleStop} data-name={row.name} text="Stop" href='#'/> |&nbsp;
						<span>{row.class_name}</span>
					</td>
					<td><T.a style={hand} onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger} href='#'/></td>
			</tr>;
		})

		return <div>
			<ButtonToolbar className="pull-right">
				<Button onClick={this.handleControlClick} data="new">
					<i className="fa fa-plus" aria-hidden="true" onClick={this.handleControlClick} data="new"></i>&nbsp;
					<T.span onClick={this.handleControlClick} data="new" text="New" />
				</Button>
			</ButtonToolbar>

			<h1><T.span text="Gateways"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Name"/></th>
					<th><T.span text="Server"/></th>
					<th><T.span text="Username"/></th>
					<th><T.span text="Register"/></th>
					<th><T.span text="Control"/></th>
					<th><T.span style={hand} text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>

			<NewGateway show={this.state.formShow} onHide={formClose} gateways = {this.state.rows} handleNewGatewayAdded={this.handleGatewayAdded.bind(this)}/>
		</div>
	}
}

export {GatewaysPage, GatewayPage};
