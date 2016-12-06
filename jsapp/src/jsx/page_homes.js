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
import { Modal, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { EditControl } from './xtools'

class NewHome extends React.Component {
	propTypes: {handleNewHomeAdded: React.PropTypes.func}

	constructor(props) {
		super(props);

		this.last_id = 0;
		this.state = {errmsg: ''};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var home = form2json('#newHomeForm');
		console.log("home", home);

		if (!home.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/homes",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(home),
			success: function (obj) {
				_this.props["data-handleNewHomeAdded"](obj);
			},
			error: function(msg) {
				console.error("home", msg);
			}
		});
	}

	render() {
		console.log(this.props);

		return <Modal {...this.props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New User" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newHomeForm">
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="name" /></Col>
				</FormGroup>

				<FormGroup controlId="formStarttime">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Starttime" /></Col>
					<Col sm={10}><FormControl type="datetime-local" name="starttime" /></Col>
				</FormGroup>
				
				<FormGroup controlId="formEndtime">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Endtime" /></Col>
					<Col sm={10}><FormControl type="datetime-local" name="endtime" /></Col>
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

class HomePage extends React.Component {
	propTypes: {handleNewHomeAdded: React.PropTypes.func}

	constructor(props) {
		super(props);

		this.state = {errmsg: '', user: {}, edit: false};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleControlClick = this.handleControlClick.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var user = form2json('#newHomeForm');
		console.log("user", user);

		if (!user.extn || !user.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/users/" + user.id,
			headers: {"X-HTTP-Method-Override": "PUT"},
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(user),
			success: function () {
				_this.setState({user: user, errmsg: {key: "Saved at", time: Date()}})
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
		$.getJSON("/api/users/" + this.props.params.id, "", function(data) {
			console.log("user", data);
			_this.setState({user: data});
		}, function(e) {
			console.log("get users ERR");
		});
	}

	render() {
		const user = this.state.user;
		let save_btn = "";
		let err_msg = "";

		if (this.state.edit) {
			save_btn = <Button><T.span onClick={this.handleSubmit} text="Save"/></Button>
			if (this.state.errmsg) {
				err_msg  = <Button><T.span text={this.state.errmsg} className="danger"/></Button>
			}
		}

		return <div>
			<ButtonGroup className="controls">
				{err_msg} { save_btn }
				<Button><T.span onClick={this.handleControlClick} text="Edit"/></Button>
			</ButtonGroup>

			<h1>{user.name} &lt;{user.extn}&gt;</h1>
			<hr/>

			<Form horizontal id="newUserForm">
				<input type="hidden" name="id" defaultValue={user.id}/>
				<FormGroup controlId="formExtn">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Number" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="extn" defaultValue={user.extn}/></Col>
				</FormGroup>

				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="name" defaultValue={user.name}/></Col>
				</FormGroup>

				<FormGroup controlId="formPassword">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Password" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="password" defaultValue={user.password} type="password"/></Col>
				</FormGroup>

				<FormGroup controlId="formVMPassword">
					<Col componentClass={ControlLabel} sm={2}><T.span text="VM Password"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="vm_password" defaultValue={user.vm_password} type="password" /></Col>
				</FormGroup>

				<FormGroup controlId="formContext">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Context" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="context" defaultValue={user.context}/></Col>
				</FormGroup>

				<FormGroup controlId="formCidName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="CID Name"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="cid_name" defaultValue={user.cid_name}/></Col>
				</FormGroup>

				<FormGroup controlId="formLength">
					<Col componentClass={ControlLabel} sm={2}><T.span text="CID Number" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="cid_number" defaultValue={user.cid_number}/></Col>
				</FormGroup>
			</Form>
		</div>
	}
}

class HomesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { formShow: false, rows: [], danger: false};

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
		var id = e.target.getAttribute("data-id");
		console.log("deleting id", id);
		var _this = this;

		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));

			if (!c) return;
		}

		$.ajax({
			type: "DELETE",
			url: "/api/homes/" + id,
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
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/homes", "", function(data) {
			console.log("homes", data)
			_this.setState({rows: data});
		}, function(e) {
			console.log("get homes ERR");
		});
	}

	handleFSEvent(v, e) {
	}

	handleHomeAdded(route) {
		var rows = this.state.rows;
		rows.push(route);
		this.setState({rows: rows, formShow: false});
	}

	render() {
		let formClose = () => this.setState({ formShow: false });
		let toggleDanger = () => this.setState({ danger: !this.state.danger });
	    var danger = this.state.danger ? "danger" : "";

		var _this = this;
		var tstate;
		var rows = this.state.rows.map(function(row) {
			if(row.state == 'out'){
				tstate = 'wait_start';
			}
			if(row.state == 'ing'){
				tstate = 'conference_ing';
			}
			if(row.state == 'end'){
				tstate = 'end_conference';
			}
			return <tr key={row.id}>
					<td>{row.id}</td>
					<td><Link to={`/conferent/homes/${row.id}`}>{row.name}</Link></td>
					<td>{tstate}</td>
					<td>{row.starttime}</td>
					<td>{row.endtime}</td>
					<td>
						<T.a onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger}/>
					</td>
			</tr>;
		})

		return <div>
			<div className="controls">
				<Button>
					<i className="fa fa-plus" aria-hidden="true"></i>&nbsp;
					<T.span onClick={this.handleControlClick} data="new" text="New" />
				</Button>
			</div>

			<h1><T.span text="Homes"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Name"/></th>
					<th><T.span text="State"/></th>
					<th><T.span text="Starttime"/></th>
					<th><T.span text="Endtime"/></th>
					<th><T.span text="Play" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>

			<NewHome show={this.state.formShow} onHide={formClose} data-handleNewHomeAdded={this.handleHomeAdded.bind(this)}/>
		</div>
	}
}

export {HomesPage, HomePage};
