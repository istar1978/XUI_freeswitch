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
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { EditControl, xFetchJSON } from './libs/xtools';

class TicketPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {ticket: {}, users: [], user_options: null, ticket_comments: [], deal_user: null};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		var _this = this;
		var ticket = form2json('#ticketProcessingForm');
		if (!ticket.content) {
			notify(<T.span text="Mandatory fields left blank"/>, "error");
			return;
		}

		xFetchJSON("/api/tickets/" + this.state.ticket.id + "/comments", {
			method: "POST",
			body: JSON.stringify(ticket)
		}).then((obj) => {
			var rows = this.state.ticket_comments;
			rows.unshift(obj);
			this.setState({ticket_comments: rows, deal_user: null,hidden_user: null});
		}).catch((err) => {
			console.error("ticket", err);
			notify(err, "error");
		});
	}

	componentDidMount() {
		var _this = this;
		xFetchJSON("/api/tickets/" + _this.props.params.id, "").then((data) => {
			console.log("ticket", data);
			_this.setState({ticket: data});
		}).catch((e) => {
			console.error("get ticket", e);
		});

		xFetchJSON("/api/users/bind").then((data) => {
			this.setState({users: data});
		});

		xFetchJSON("/api/tickets/" + _this.props.params.id + '/comments').then((data) => {
			console.log('addddd', data)
			this.setState({ticket_comments: data});
		});
	}

	render() {
		const ticket_comments = this.state.ticket_comments.map(function(row) {
			return <Row key={row.id}>
				<Col componentClass={ControlLabel} sm={2}>{row.created_epoch}</Col>
				<Col sm={10}>{row.created_epoch} {row.user_name}
					<img className="avatar" src={row.avatar_url}/>
					<br/> {row.content}
				</Col>
			</Row>
		})

		const ticket = this.state.ticket;
		var status = '';
		if(ticket.status == 1){
			status = '未完成';
		}
		if(ticket.status == 2){
			status = '已完成';
		}
		let save_btn = "";
		let hidden_user = "";
		const users = this.state.users;
		let deal_user = <FormControl componentClass="select" name="current_user_id">{
				users.map(function(row) {
					return <option key={row.id} value={row.id}>{row.name}</option>
				})
			}
		</FormControl>;
		if(ticket.current_user_id){
			users.map(function(row) {
				if(row.id == ticket.current_user_id){
					deal_user = <FormControl type="input" readOnly="readonly" value={row.name}/>
					hidden_user = <FormControl type="hidden" name="current_user_id" value={row.id}/>
				}
			})
		}

		this.state.deal_user = deal_user;
		this.state.hidden_user = hidden_user;

		save_btn = <Button onClick={this.handleSubmit}><T.span text="指派"/></Button>

		const options = <FormGroup>
			<Col componentClass={ControlLabel} sm={2}><T.span text="处理人" /></Col>
			<Col sm={10}>
				{this.state.deal_user}
			</Col>
		</FormGroup>;

		const src = "http://118.89.102.147:8081/"+ticket.record_path
		
		return <div>
			<h1><T.span text="工单"/><small>{ticket.subject}</small></h1>
			<hr/>
			<Form horizontal id="ticketForm">
			<input type="hidden" name="ticket_id" defaultValue={ticket.id}/>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="CID Number"/></Col>
					<Col sm={10}><FormControl.Static>{ticket.cid_number}</FormControl.Static></Col>
				</FormGroup>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="Created At"/></Col>
					<Col sm={10}>{ticket.created_epoch}</Col>
				</FormGroup>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="Status"/></Col>
					<Col sm={10}><T.span text={status}/></Col>
				</FormGroup>
				<FormGroup controlId="formCaller_id_name">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Record"/></Col>
					<Col sm={10}><audio src={src} controls="controls" /></Col>
				</FormGroup>
				<br/>
			</Form>
				<br/>
				<br/>
			<Form horizontal id="ticketProcessingForm">
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="内容"/></Col>
					<Col sm={10}>
						<FormControl componentClass="textarea" name="content" placeholder="内容" />
					</Col>
				</FormGroup>
				{options}
				{this.state.hidden_user}
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}></Col>
					<Col sm={10}>{save_btn}</Col>
				</FormGroup>
			</Form>

			<hr/>
			{ticket_comments}
		</div>
	}
}

class TicketsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {rows: [], danger: false};
		this.handleDelete = this.handleDelete.bind(this);
	}
	handleDelete(e) {
		var id = e.target.getAttribute("data-id");
		var _this = this;
		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));

			if (!c) return;
		}
		xFetchJSON("/api/tickets/" + id, {method: "DELETE"}).then(() => {
			console.log("deleted")
			var rows = _this.state.rows.filter(function(row) {
				return row.id != id;
			});

			this.setState({rows: rows});
		}).catch((msg) => {
			console.error("user", msg);
			notify(msg, 'error');
		});
	}
	componentWillMount () {
	}

	componentWillUnmount () {
	}

	componentDidMount () {
		xFetchJSON("/api/tickets").then((data) => {
			this.setState({rows: data});
		});
	}
	render () {
		var _this = this;
		let hand = { cursor: "pointer"};
		var danger = this.state.danger ? "danger" : "";
		var rows = _this.state.rows.map(function(row) {
			var status = '';
			if(row.status == 1){
				status = '未完成';
			}
			if(row.status == 2){
				status = '已完成';
			}
			return <tr key={row.id}>
				<td>{row.id}</td>
				<td>{row.cid_number}</td>
				<td>{row.subject}</td>
				<td>{row.created_epoch}</td>
				<td><T.span text={status}/></td>
				<td><Link to={`/tickets/${row.id}`}><T.span text="开始处理"/></Link> | <T.a style={hand} onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger}/></td>
			</tr>
		})
		return <div>
			<ButtonToolbar className="pull-right">
			</ButtonToolbar>

			<h1><T.span text="Tickets" /></h1>

			<table className="table">
				<tbody>
					<tr>
						<th><T.span text="ID"/></th>
						<th><T.span text="CID Number"/></th>
						<th><T.span text="Subject"/></th>
						<th><T.span text="Created At"/></th>
						<th><T.span text="Status"/></th>
						<th><T.span text="Action"/></th>
					</tr>
					{rows}
				</tbody>
			</table>
		</div>
	}
}

export {TicketPage, TicketsPage};
