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
import { EditControl } from './xtools'

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
			notify(<T.span text="Mandatory fields left blank"/>);
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

class ConferenceRooms extends React.Component {
	constructor(props) {
		super(props);
		this.state = { formShow: false, rows: [], danger: false};

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
			url: "/api/dicts/" + id,
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

	handleRealmClick(e) {
		const _this = this;
		console.log("realm clicked", e.target);
		var realm = e.target.getAttribute("data");

		console.log(realm);
		let url = "/api/dicts";

		if (realm) url = url + "?realm=" + realm;

        $.getJSON(url, "", function(data) {
			console.log("dt", data)
			_this.setState({rows: data});
		}, function(e) {
			console.log("get dicts ERR");
		});
	}

	handleRoomAdded(route) {
		var rows = this.state.rows;
		rows.unshift(route);
		this.setState({rows: rows, formShow: false});
	}

	isStringAcceptable() {
		return true;
	}

	render() {
		const row = this.state.rows;
		let formClose = () => this.setState({ formShow: false });
		let toggleDanger = () => this.setState({ danger: !this.state.danger });
	    var danger = this.state.danger ? "danger" : "";

		var _this = this;

		var rows = this.state.rows.map(function(row) {
			return <tr key={row.id}>
					<td>{row.id}</td>
					<td>{row.name}</td>
					<td>{row.description}</td>
					<td>{row.nbr}</td>
					<td>{row.realm}</td>
					<td>{row.capacity}</td>
					<td><T.a onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger}/></td>
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
					<th><T.span text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>

			<NewRoom show={this.state.formShow} onHide={formClose} onNewRoomAdded={this.handleRoomAdded.bind(this)}/>
		</div>
	}
}

export { ConferenceRooms };
