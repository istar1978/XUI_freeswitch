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

class NewRome extends React.Component {
	propTypes: {handleNewRomeAdded: React.PropTypes.func}

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
		var rome = form2json('#newRomeForm');
		console.log("rome", rome);

		if (!rome.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/romes",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(rome),
			success: function (obj) {
				_this.props["data-handleNewRomeAdded"](obj);
			},
			error: function(msg) {
				console.error("rome", msg);
			}
		});
	}

	render() {
		console.log(this.props);

		return <Modal {...this.props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New Room" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newRomeForm">
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

class Newtel extends React.Component {
	propTypes :{handleNewRomeAdded: React.PropTypes.func}
	
	// constructor(props) {
		// super(props);
		
		// this.handleControlClick = this.handleControlClick.bind(this);
	// }
	
	
	// constructor(props) {
		// super(props);

		// this.state = {errmsg: '', rome: {}, edit: false};

		// // This binding is necessary to make `this` work in the callback
		// this.handleSubmit = this.handleSubmit.bind(this);
		// this.handleControlClick = this.handleControlClick.bind(this);
	// }
	
	
	handleControlClick(e) {
		this.setState({edit: !this.state.edit});
	}
	
	
	
	
}

class RomePage extends React.Component {
	propTypes: {handleNewRomeAdded: React.PropTypes.func}

	constructor(props) {
		super(props);

		this.state = {errmsg: '', rome: {}, edit: false};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleControlClick = this.handleControlClick.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var rome = form2json('#newRomeForm');
		console.log("rome", rome);

		if (!rome.extn || !rome.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/romes/" + rome.id,
			headers: {"X-HTTP-Method-Override": "PUT"},
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(rome),
			success: function () {
				_this.setState({rome: rome, errmsg: {key: "Saved at", time: Date()}})
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
		$.getJSON("/api/romes/" + this.props.params.id, "", function(data) {
			console.log("rome", data);
			_this.setState({rome: data});
		}, function(e) {
			console.log("get romes ERR");
		});
	}

	render() {
		const rome = this.state.rome;
		let save_btn = "";
		let err_msg = "";
		if (this.state.edit) {
			save_btn = <Button><T.span onClick={this.handleSubmit} text="Save"/></Button>
			if (this.state.errmsg) {
				err_msg = <Button><T.span text={this.state.errmsg} className="danger"/></Button>
			}
		}
		var tstate;
		if(rome.state == 'out'){
			tstate = <T.span text="Outcon"/>
		}
		if(rome.state == 'ing'){
			tstate = <T.span text="Ingcon"/>
		}
		if(rome.state == 'end'){
			tstate = <T.span text="Endcon"/>
		}
		return <div>
			<ButtonGroup className="controls">
				{err_msg} { save_btn }
				<Button>
				
				<T.span onClick={this.handleControlClick} data="newtel" text="Add New Tel"/>
				
				</Button>
					
			</ButtonGroup>
			<h1>{rome.name}</h1>
			<hr/>
				<Form horizontal>
				<input type="hidden" name="id" defaultValue={rome.id}/>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name"/></Col>
					<Col sm={10}><EditControl defaultValue={rome.name}/></Col>
				</FormGroup>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="State"/></Col>
					<Col sm={10}><EditControl defaultValue={rome.state}/></Col>
				</FormGroup>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="Starttime"/></Col>
					<Col sm={10}><EditControl defaultValue={rome.starttime}/></Col>
				</FormGroup>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="Endtime"/></Col>
					<Col sm={10}><EditControl defaultValue={rome.endtime}/></Col>
				</FormGroup>
				</Form>
		</div>
	}
}

class RomesPage extends React.Component {
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
			url: "/api/romes/" + id,
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
		$.getJSON("/api/romes", "", function(data) {
			console.log("romes", data)
			_this.setState({rows: data});
		}, function(e) {
			console.log("get romes ERR");
		});
	}

	handleFSEvent(v, e) {
	}

	handleRomeAdded(route) {
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
				tstate = <T.span text="Outcon"/>
			}
			if(row.state == 'ing'){
				tstate = <T.span text="Ingcon"/>
			}
			if(row.state == 'end'){
				tstate = <T.span text="Endcon"/>
			}
			return <tr key={row.id}>
					<td>{row.id}</td>
					<td><Link to={`/conferent/romes/${row.id}`}>{row.name}</Link></td>
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

			<h1><T.span text="Romes"/></h1>
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

			<NewRome show={this.state.formShow} onHide={formClose} data-handleNewRomeAdded={this.handleRomeAdded.bind(this)}/>
			<Newtel show={this.state.formShow} onHide={formClose} data-handleNewTelAdded={this.handleRomeAdded.bind(this)}/>
		</div>
	}
}

export {RomesPage, RomePage};
