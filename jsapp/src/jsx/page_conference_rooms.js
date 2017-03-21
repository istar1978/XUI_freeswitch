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
 * blocks.jsx - Blocks Page
 *
 */

'use strict';

import React from 'react';
import T from 'i18n-react';
import ReactDOM from 'react-dom';
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek'
import { EditControl } from './xtools'

class NewMember extends React.Component {
	propTypes: {handleNewRoomAdded: React.PropTypes.func}

	constructor(props) {
		super(props);
		// This binding is necessary to make `this` work in the callback
		this.state = {errmsg: ''};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var member = form2json('#newMember');
		console.log("member", member);

		if (!member.name || !member.num) {
			_this.setState({ errmsg: "Mandatory fields left blank" });
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/conference_rooms/" + this.props.room_id + '/members',
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(member),
			success: function (obj) {
				console.log(obj);
				member.id = obj.id;
				_this.props.onNewMemberAdded(member);
			},
			error: function(msg) {
				console.error("member", msg);
			}
		});
	}

	render() {
		console.log(this.props);
		const props = Object.assign({}, this.props);
		delete props.onNewMemberAdded;
		delete props.room_id;

		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Add New Member" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newMember">
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="name" placeholder="Seven Du" /></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description" /></Col>
					<Col sm={10}><FormControl type="input" name="description" placeholder="Seven Du" /></Col>
				</FormGroup>

				<FormGroup controlId="fromNumber">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Number" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="num" placeholder="7777" /></Col>
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

class RoomMembers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {members: [], memberFormShow: false, danger: false}
	}

	handleMemberAdded(member) {
		var members = this.state.members;
		members.unshift(member);
		this.setState({members: members, memberFormShow: false});
	}

	handleDelete(e) {
		e.preventDefault();

		var id = e.target.getAttribute("data-id");
		console.log("deleting id", id);
		var _this = this;

		if (!_this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));

			if (!c) return;
		}

		$.ajax({
			type: "DELETE",
			url: "/api/conference_rooms/" + this.props.room_id + "/members/" + id,
			success: function () {
				console.log("deleted")
				var members = _this.state.members.filter(function(m) {
					return m.id != id;
				});

				_this.setState({members: members});
			},
			error: function(msg) {
				console.error("conference membe", msg);
			}
		});
	}

	componentDidMount() {
		const _this = this;

		$.getJSON("/api/conference_rooms/" + _this.props.room_id + "/members", function(data) {
			_this.setState({members: data});
		});
	}

	render() {
		const memberFormClose = () => this.setState({ memberFormShow: false });
		const toggleDanger = () => this.setState({ danger: !this.state.danger });
		const danger = this.state.danger ? "danger" : null
		const _this = this;

		return <div>
			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				<Button onClick={() => this.setState({ memberFormShow: true })}>
					<i className="fa fa-plus" aria-hidden="true"></i>&nbsp;
					<T.span text="Add Member" />
				</Button>
			</ButtonGroup>
			</ButtonToolbar>
			<h2><T.span text="Members"/></h2>
			<table className="table">
				<tbody>
				<tr>
					<th><T.span text="Name" data="k"/></th>
					<th><T.span text="Number"/></th>
					<th style={{textAlign: "right"}}>
						<T.span style={{cursor: "pointer"}} text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/>
					</th>
				</tr>
				{
					this.state.members.map(function (m){
						return <tr key={m.id}>
							<td>{m.name}</td>
							<td>{m.num}</td>
							<td style={{textAlign: "right"}}>
								<T.a onClick={_this.handleDelete.bind(_this)} data-id={m.id} text="Delete" className={danger} href="#"/>
							</td>
						</tr>
					})
				}
				</tbody>
			</table>

			<NewMember room_id = {this.props.room_id}
				show={this.state.memberFormShow} onHide={memberFormClose}
				onNewMemberAdded={this.handleMemberAdded.bind(this)}/>
		</div>
	}
}

class NewRoom extends React.Component {
	propTypes: {handleNewRoomAdded: React.PropTypes.func}

	constructor(props) {
		super(props);

		this.state = {errmsg: ''};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var room = form2json('#newRoom');
		console.log("room", room);

		if (!room.name || !room.nbr) {
			_this.setState({ errmsg: "Mandatory fields left blank" });
			return;
		}

		room.realm = domain;

		$.ajax({
			type: "POST",
			url: "/api/conference_rooms",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(room),
			success: function (obj) {
				console.log(obj);
				room.id = obj.id;
				_this.props.onNewRoomAdded(room);
			},
			error: function(msg) {
				console.error("room", msg);
			}
		});
	}

	render() {
		console.log(this.props);
		const props = Object.assign({}, this.props);
		delete props.onNewRoomAdded;

		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New Room" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newRoom">
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="name" placeholder="Seven's Room" /></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description" /></Col>
					<Col sm={10}><FormControl type="input" name="description" placeholder="A Test Room" /></Col>
				</FormGroup>

				<FormGroup controlId="fromNumber">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Number" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="nbr" placeholder="3000" /></Col>
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

class ConferenceRoom extends React.Component {
	constructor(props) {
		super(props);

		this.state = {room: {}, params:[], edit: false};
		this.handleChange = this.handleChange.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.handleToggleParam = this.handleToggleParam.bind(this);
		this.toggleHighlight = this.toggleHighlight.bind(this);
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
	
	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var room = form2json('#editRoomForm');

		if (!room.name || !room.nbr) {
			notify(<T.span text="Mandatory fields left blank"/>, 'error');
			return;
		}

		$.ajax({
			type: "PUT",
			url: "/api/conference_rooms/" + room.id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(room),
			success: function () {
				_this.setState({room: room, edit: false})
				notify(<T.span text={{key:"Saved at", time: Date()}}/>);
			},
			error: function(msg) {
				console.error("room", msg);
			}
		});
	}
	
	handleToggleParam(e) {
		const _this = this;
		const data = e.target.getAttribute("data");
		$.ajax({
			type: "PUT",
			url: "/api/conference_profiles/" + this.state.cr.id + "/params/" + data,
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
			url: "/api/conference_profiles/" + this.state.cr.id + "/params/" + id,
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

	handleControlClick(e) {
		this.setState({edit: !this.state.edit});
	}

	isStringAcceptable() {
		return true;
	}

	toggleHighlight() {
		this.setState({highlight: !this.state.highlight});
	}

	componentDidMount() {
		const _this = this;

		$.getJSON("/api/conference_rooms/" + this.props.params.id, "", function(data) {
			_this.setState({room: data});
		}, function(e) {
			console.log("get gw ERR");
		});

		$.getJSON("/api/conference_profiles/" + this.props.params.id, "", function(data) {
			const params = data.params;
			_this.setState({cr: data, params: params});
		}, function(e) {
			console.log("get re ERR");
		});
	}

	render() {
		const room = this.state.room;
		let save_btn = null;
		let err_msg = null;
		let params = <tr></tr>;
		var _this = this;
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
			save_btn = <Button onClick={this.handleSubmit.bind(this)}>
				<i className="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;
				<T.span text="Save"/>
			</Button>
		}

		return <div>
			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				{ save_btn }
				<Button onClick={this.handleControlClick.bind(this)}>
					<i className="fa fa-edit" aria-hidden="true"></i>&nbsp;
					<T.span text="Edit"/>
				</Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h1>{room.name} <small>{room.nbr}</small></h1>
			<hr/>

			<Form horizontal id='editRoomForm'>
				<input type="hidden" name="id" defaultValue={room.id}/>
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="name" defaultValue={room.name}/></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="description" defaultValue={room.description}/></Col>
				</FormGroup>

				<FormGroup controlId="formNumber">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Number" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="nbr" defaultValue={room.nbr}/></Col>
				</FormGroup>

				<FormGroup controlId="formPIN">
					<Col componentClass={ControlLabel} sm={2}><T.span text="PIN"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="pin" defaultValue={room.pin}/></Col>
				</FormGroup>

				<FormGroup controlId="formCapacity">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Capacity"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="capacity" defaultValue={room.capacity}/></Col>
				</FormGroup>

				<FormGroup controlId="formRealm">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Realm" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="realm" defaultValue={room.realm}/></Col>
				</FormGroup>

				<FormGroup controlId="formSave">
					<Col componentClass={ControlLabel} sm={2}></Col>
					<Col sm={10}>{save_btn}</Col>
				</FormGroup>
			</Form>

			{
				room.id ? <RoomMembers room_id={this.state.room.id} /> : null
			}

			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				<Button onClick={this.toggleHighlight}>
					<i className="fa fa-edit" aria-hidden="true"></i>&nbsp;
					<T.span text="Edit"/>
				</Button>
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

class ConferenceRooms extends React.Component {
	constructor(props) {
		super(props);
		this.state = { formShow: false, rows: [], danger: false};
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

		if (!_this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));

			if (!c) return;
		}

		$.ajax({
			type: "DELETE",
			url: "/api/conference_rooms/" + id,
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

	handleSortClick(e) {
		var data = e.target.getAttribute("data");
		console.log("data", data);
		var rows = this.state.rows;

		if (data == "realm") {
			rows.sort(function(a,b){
				return (a.realm[0].toLowerCase().charCodeAt() - b.realm[0].toLowerCase().charCodeAt());
			})

			this.setState({rows: rows});
		}

		if (data == "key") {
			rows.sort(function(a,b){
				return (a.k[0].toLowerCase().charCodeAt() - b.k[0].toLowerCase().charCodeAt());
			})

			this.setState({rows: rows});
		}

		if (data == "order") {
			rows.sort(function(a,b){
				return parseInt(b.o) - parseInt(a.o);
			})

			this.setState({rows: rows});
		};
	}

	handleClick(x) {
	}

	componentWillMount() {
	}

	componentWillUnmount() {
	}

	componentDidMount() {
		var _this = this;

		let url = "/api/conference_rooms";

        $.getJSON(url, "", function(data) {
			console.log("rooms", data)
			_this.setState({rows: data});
		}, function(e) {
			console.log("get rooms ERR");
		});
	}

	handleRoomAdded(route) {
		var rows = this.state.rows;
		rows.unshift(route);
		this.setState({rows: rows, formShow: false});
	}

	render() {
		const row = this.state.rows;
		let formClose = () => this.setState({ formShow: false });
		let toggleDanger = () => this.setState({ danger: !this.state.danger });
		let hand = { cursor: "pointer" };
	    var danger = this.state.danger ? "danger" : "";

		var _this = this;

		var rows = this.state.rows.map(function(row) {
			return <tr key={row.id}>
					<td>{row.id}</td>
					<td><Link to={`/settings/conference_rooms/${row.id}`}>{row.name}</Link></td>
					<td>{row.description}</td>
					<td>{row.nbr}</td>
					<td>{row.realm}</td>
					<td>{row.capacity}</td>
					<td><T.a onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger} href="#"/></td>
			</tr>;
		})

		return <div>
			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				<Button onClick={this.handleControlClick.bind(this)} data="new">
					<i className="fa fa-plus" aria-hidden="true" data="new"></i>&nbsp;
					<T.span text="New" data="new"/>
				</Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h1><T.span text="Conference Rooms"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Name" onClick={this.handleSortClick.bind(this)} data="name" /></th>
					<th><T.span text="Description" /></th>
					<th><T.span text="Number" onClick={this.handleSortClick.bind(this)} data="number" /></th>
					<th><T.span text="Realm" onClick={this.handleSortClick.bind(this)} data="realm" /></th>
					<th><T.span text="Capacity"/></th>
					<th><T.span style={hand} text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>

			<NewRoom show={this.state.formShow} onHide={formClose} onNewRoomAdded={this.handleRoomAdded.bind(this)}/>
		</div>
	}
}

export { ConferenceRooms, ConferenceRoom };
