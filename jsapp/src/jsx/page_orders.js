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
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { EditControl, xFetchJSON } from './libs/xtools';

class ORDERPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {order: {}, users: [], user_options: null, ordering: [], deal_user: null};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		var _this = this;
		var order = form2json('#ORDERForm');
		if (!order.content) {
			notify(<T.span text="Mandatory fields left blank"/>, "error");
			return;
		}

		xFetchJSON("/api/orders",{
				method: "POST",
				body: JSON.stringify(order)
			}).then((obj) => {
				var rows = this.state.ordering;
				rows.unshift(obj);
				this.setState({ordering: rows, deal_user: 123});
			}).then((msg) => {
				console.error("order", msg);
				this.setState({errmsg: <T.span text={{key: "Internal Error", msg: msg}}/>});
		});
	}
	componentDidMount() {
		var _this = this;
		xFetchJSON("/api/orders/" + _this.props.params.id, "").then((data) => {
			console.log("order", data);
			_this.setState({order: data});
		}).catch((e) => {
			console.error("get order", e);
		});
		xFetchJSON("/api/users").then((data) => {
			this.setState({users: data});
		});
		xFetchJSON("/api/ordering/" + _this.props.params.id, "").then((data) => {
			this.setState({ordering: data});
		});
	}
	render() {
			const ordering = this.state.ordering.map(function(row) {
				return <FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="最新消息：" /></Col>
					<Col sm={10}>{row.content}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;时间：{row.time}</Col>
				</FormGroup>
			})
		const order = this.state.order;
		let save_btn = "";
		const users = this.state.users;
		let deal_user = <FormControl componentClass="select" name="uid">{
				users.map(function(row) {
					return <option key={row.id} readonly="readonly" value={row.id}>{row.name}</option>
				})
			}
		</FormControl>;
		if(order.uid){
			users.map(function(row) {
				if(row.id == order.uid){
					deal_user = row.name;
				}
			})
		}
		this.state.deal_user = deal_user;
		save_btn = <Button onClick={this.handleSubmit}><T.span text="指派"/></Button>
		const options = <FormGroup>
			<Col componentClass={ControlLabel} sm={2}><T.span text="处理人" /></Col>
			<Col sm={10}>
				{this.state.deal_user}
			</Col>
		</FormGroup>;
		var status = "";
		if(order.status == 1){
			status = "未完成";
		}if(order.status == 2){
			status = "已完成";
		}
		return <div>
			<h1><T.span text="工单"/></h1>
			<hr/>
			<Form horizontal id="ORDERForm">
				<input type="hidden" name="tid" defaultValue={order.id}/>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="电话"/></Col>
					<Col sm={10}>{order.tel}</Col>
				</FormGroup>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="提交时间"/></Col>
					<Col sm={10}>{order.time}</Col>
				</FormGroup>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="状态"/></Col>
					<Col sm={10}>{status}</Col>
				</FormGroup>
				<br/>
				{ordering}
				<br/>
				<br/>
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}><T.span text="内容"/></Col>
					<Col sm={10}>
						<FormControl type="input" name="content" placeholder="写入内容" />
					</Col>
				</FormGroup>
				{options}
				<FormGroup>
					<Col componentClass={ControlLabel} sm={2}></Col>
					<Col sm={10}>{save_btn}</Col>
				</FormGroup>
			</Form>
		</div>
	}
}

class ORDERsPage extends React.Component {
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
		xFetchJSON("/api/orders/" + id, {method: "DELETE"}).then(() => {
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
		xFetchJSON("/api/orders").then((data) => {
			this.setState({rows: data});
		});
	}
	render () {
		var _this = this;
		let hand = { cursor: "pointer"};
		var danger = this.state.danger ? "danger" : "";
		var rows = _this.state.rows.map(function(row) {
			var status = "";
			if(row.status == 1){
				status = "未完成";
			}
			if(row.status == 2){
				status = "已完成";
			}
			return <tr>
				<td>{row.id}</td>
				<td>{row.tel}</td>
				<td>{row.time}</td>
				<td>{status}</td>
				<td><Link to={`/orders/${row.id}`}><T.span text="开始处理"/></Link>/<T.a style={hand} onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger}/></td>
			</tr>
		})
		return <table className="table">
			<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="电话"/></th>
					<th><T.span text="提交时间"/></th>
					<th><T.span text="状态"/></th>
					<th><T.span text="操作"/></th>
				</tr>
				{rows}
			</tbody>
		</table>
	}
}

export {ORDERPage, ORDERsPage};
