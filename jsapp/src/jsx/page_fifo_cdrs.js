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
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { EditControl } from './xtools';

class FifoCDRPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {fifocdr: {}, edit: false};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/fifo_cdrs/" + _this.props.params.channel_uuid, "", function(data) {
			console.log("fifocdr", data);
			_this.setState({fifocdr: data});
			console.log(_this.state.fifocdr)
		}, function(e) {
			console.log("get cdr ERR");
		});
	}

	render() {
		const fifocdr = this.state.fifocdr;

		return <div>
			<h1><T.span text="FIFO CDR"/> <small>{fifocdr.channel_uuid}</small></h1>
			<hr/>

			<Form horizontal id="FIFOCDRForm">
				<input type="hidden" name="id" defaultValue={fifocdr.channel_uuid}/>
				<FormGroup controlId="formCaller_id_name">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Record"/></Col>
					<Col sm={10}><audio src="" /></Col>
				</FormGroup>

				<FormGroup controlId="formUUID">
					<Col componentClass={ControlLabel} sm={2}><T.span text="UUID"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="channel_uuid" defaultValue={fifocdr.channel_uuid}/></Col>
				</FormGroup>

				<FormGroup controlId="formFIFOName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="FIFO Name"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="channel_uuid" defaultValue={fifocdr.fifo_name}/></Col>
				</FormGroup>

				<FormGroup controlId="formCID">
					<Col componentClass={ControlLabel} sm={2}><T.span text="CID Number"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="channel_uuid" defaultValue={fifocdr.ani}/></Col>
				</FormGroup>

				<FormGroup controlId="formDest">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Dest Number"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="channel_uuid" defaultValue={fifocdr.dest_number}/></Col>
				</FormGroup>

				<FormGroup controlId="formBridged">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Bridged Number"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="channel_uuid" defaultValue={fifocdr.bridged_number}/></Col>
				</FormGroup>

				<FormGroup controlId="formStart">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Start"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="channel_uuid" defaultValue={xdatetime(fifocdr.start_epoch)}/></Col>
				</FormGroup>

				<FormGroup controlId="formAnswer">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Answer"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="channel_uuid" defaultValue={xdatetime(fifocdr.bridge_epoch)}/></Col>
				</FormGroup>

				<FormGroup controlId="formEnd">
					<Col componentClass={ControlLabel} sm={2}><T.span text="End"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="channel_uuid" defaultValue={xdatetime(fifocdr.end_epoch)}/></Col>
				</FormGroup>
			</Form>
		</div>
	}
}

class FifoCDRsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {rows: [], query_visible: false};
		this.handleMore = this.handleMore.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleQuery = this.handleQuery.bind(this);
	}

	handleClick (x) {
	}

	handleControlClick (e) {
		console.log("clicked", e.target);
	}

	handleMore (e) {
		e.preventDefault();
		this.setState({query_visible: !this.state.query_visible})
	}

	handleSearch (e) {
		const _this = this;
		const qs = "startDate=" + this.startDate.value +
			"&endDate=" + this.endDate.value +
			"&ani=" + this.ani.value +
			"&dest_number=" + this.dest_number.value +
			"&bridged_number=" + this.bridged_number.value +
			"&id=2";

		console.log(qs);

		$.getJSON("/api/fifo_cdrs?" + qs, function(fifocdrs) {
			_this.setState({rows: fifocdrs});
		})
	}

	componentWillMount () {
	}

	componentWillUnmount () {
	}

	componentDidMount () {
		const _this = this;

		$.getJSON("/api/fifo_cdrs?id=0", function(fifocdrs) {
			_this.setState({rows: fifocdrs});
		})
	}

	handleQuery (e) {
		var _this = this;
		var data = parseInt(e.target.getAttribute("data"));

		e.preventDefault();

		$.getJSON("/api/fifo_cdrs?last=" + data + "&id=1", function(fifocdrs) {
			_this.setState({rows: fifocdrs});
		})
	}

	render () {
		var _this = this;
		var rows = this.state.rows.map(function(row) {
			return <tr key={row.id}>
				<td><Link to={`/fifocdrs/${row.channel_uuid}`}>{row.channel_uuid}</Link></td>
				<td>{row.fifo_name}</td>
				<td>{row.ani}</td>
				<td>{row.dest_number}</td>
				<td>{row.bridged_number}</td>
				<td>{xdatetime(row.start_epoch)}</td>
				<td>{xdatetime(row.bridge_epoch)}</td>
				<td>{xdatetime(row.end_epoch)}</td>
			</tr>
		});

		var now = new Date();
		var nowdate = Date.parse(now);
		var sevenDaysBeforenowtime = nowdate - 7*24*60*60*1000;
		var sevenDaysBeforenowdate = new Date(sevenDaysBeforenowtime);

		function getTime(time){
			var month = (time.getMonth() + 1);
			var day = time.getDate();
			if (month < 10)
				month = "0" + month;
			if (day < 10) 
			day = "0" + day;
			return time.getFullYear() + '-' + month + '-' + day;
		}

		var today = getTime(now);
		var sevenDaysBeforeToday = getTime(sevenDaysBeforenowdate);

		return <div>
			<ButtonToolbar className="pull-right">
				<T.span text="Last"/> &nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 7}} data="7" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 15}} data="15" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 30}} data="30" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 60}} data="60" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", day: 90}} data="90" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleMore} text="More" data="more" href="#"/>...
			</ButtonToolbar>			

			<h1><T.span text="FIFO CDRs"/></h1>
			<div>
				{this.state.query_visible && <div style={{padding: "5px"}} className="pull-right">
					<input type="date" defaultValue={sevenDaysBeforeToday} ref={(input) => { _this.startDate = input; }}/> -&nbsp;
					<input type="date" defaultValue={today} ref={(input) => { _this.endDate = input; }}/> &nbsp;
					<T.span text="CID Number"/><input ref={(input) => { _this.ani = input; }}/> &nbsp;
					<T.span text="Dest Number"/><input ref={(input) => { _this.dest_number = input; }}/> &nbsp;
					<T.span text="Bridged Number"/><input ref={(input) => { _this.bridged_number = input; }}/> &nbsp;
					<T.button text="Search" onClick={this.handleSearch}/>
				</div>}

				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="UUID"/></th>
					<th><T.span text="FIFO Name"/></th>
					<th><T.span text="CID Number"/></th>
					<th><T.span text="Dest Number"/></th>
					<th><T.span text="Bridged Number"/></th>
					<th><T.span text="Start"/></th>
					<th><T.span text="Answer"/></th>
					<th><T.span text="End"/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

export {FifoCDRsPage, FifoCDRPage};
