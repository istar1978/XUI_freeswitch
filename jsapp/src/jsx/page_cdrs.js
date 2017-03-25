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
import { EditControl } from './xtools';

class CDRPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {cdr: {}, edit: false};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/cdrs/" + _this.props.params.uuid, "", function(data) {
			console.log("cdr", data);
			_this.setState({cdr: data});
		}, function(e) {
			console.error("get cdr", e);
			notify('[' + e.status + '] ' + e.statusText);
		});
	}

	render() {
		const cdr = this.state.cdr;

		return <div>
			<h1><T.span text="CDR"/> <small>{cdr.uuid}</small></h1>
			<hr/>

			<Form horizontal id="CDRForm">
				<input type="hidden" name="id" defaultValue={cdr.id}/>
				<FormGroup controlId="formCaller_id_name">
					<Col componentClass={ControlLabel} sm={2}><T.span text="CID Name"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="caller_id_name" defaultValue={cdr.caller_id_name}/></Col>
				</FormGroup>

				<FormGroup controlId="formCaller_id_number">
					<Col componentClass={ControlLabel} sm={2}><T.span text="CID Number"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="caller_id_number" defaultValue={cdr.caller_id_number}/></Col>
				</FormGroup>

				<FormGroup controlId="formDestination_number">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Dest Number"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="destination_number" defaultValue={cdr.destination_number}/></Col>
				</FormGroup>

				<FormGroup controlId="formContext">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Context"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="context" defaultValue={cdr.context}/></Col>
				</FormGroup>

				<FormGroup controlId="formStart_stamp">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Start" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="start_stamp" defaultValue={cdr.start_stamp}/></Col>
				</FormGroup>

				<FormGroup controlId="formAnswer_stamp">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Answer"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="answer_stamp" defaultValue={cdr.answer_stamp}/></Col>
				</FormGroup>

				<FormGroup controlId="formEnd_stamp">
					<Col componentClass={ControlLabel} sm={2}><T.span text="End" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="end_stamp" defaultValue={cdr.end_stamp}/></Col>
				</FormGroup>

				<FormGroup controlId="formDuration">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Duration" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="duration" defaultValue={cdr.duration}/></Col>
				</FormGroup>

				<FormGroup controlId="formBillsec">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Bill Sec" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="billsec" defaultValue={cdr.billsec}/></Col>
				</FormGroup>

				<FormGroup controlId="formHangup_cause">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Cause" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="hangup_cause" defaultValue={cdr.hangup_cause}/></Col>
				</FormGroup>

				<FormGroup controlId="formAccount_code">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Account Code" /></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="account_code" defaultValue={cdr.account_code}/></Col>
				</FormGroup>
			</Form>
		</div>
	}
}

class CDRsPage extends React.Component {
	constructor(props) {
		super(props);
		var theRows = localStorage.getItem("theRows");
    	if (theRows == null) {
	    	var r = 10000;
	    	localStorage.setItem("theRows", r);
     	}
     	this.state = {rows: [], loaded: false, hiddendiv: 'none'};
     	this.handleQuery = this.handleQuery.bind(this);
     	this.handleSearch = this.handleSearch.bind(this);
     	this.handleMore = this.handleMore.bind(this);
	}

	handleClick (x) {
	}

	handleControlClick (e) {
		console.log("clicked", e.target);
	}

	handleMore (e) {
		e.preventDefault();
		this.setState({hiddendiv: this.state.hiddendiv == 'none' ? 'block' : 'none'});
	}

	handleSearch (e) {
		const _this = this;
		const qs = "startDate=" + this.startDate.value +
			"&endDate=" + this.endDate.value +
			"&cidNumber=" + this.cidNumber.value +
			"&destNumber=" + this.destNumber.value;
		console.log(qs);

		$.getJSON("/api/cdrs?" + qs, function(cdrs) {
			_this.setState({rows: cdrs});
		})
	}

	componentWillMount () {
	}

	componentWillUnmount () {
	}

	componentDidMount () {
		const _this = this;
		$.getJSON("/api/cdrs", function(cdrs) {
			_this.setState({rows: cdrs, loaded : true});
		})
	}

	handleQuery (e) {
		var _this = this;
		var data = parseInt(e.target.getAttribute("data"));

		e.preventDefault();

		$.getJSON("/api/cdrs?last=" + data, function(cdrs) {
			_this.setState({rows: cdrs});
		})
	}

	render () {
		var _this = this;
		let isShow;

		var rows = this.state.rows.map(function(row) {
			return <tr key={row.uuid}>
				<td>{row.caller_id_name}</td>
				<td>{row.caller_id_number}</td>
				<td>{row.destination_number}</td>
				<td>{row.context}</td>
				<td>{row.start_stamp}</td>
				<td>{row.answer_stamp}</td>
				<td>{row.end_stamp}</td>
				<td>{row.duration}</td>
				<td>{row.billsec}</td>
				<td>{row.hangup_cause}</td>
				<td>{row.account_code}</td>
				<td><Link to={`/cdrs/${row.uuid}`}><T.span text="Detail"/></Link></td>
			</tr>
		})

		if(this.state.loaded){
			isShow = "none";
		}

		const loadSpinner = {
			width : "200px",
			height : "200px",
			margin : "auto", 
			clear : "both",
			display : "block",
			color : 'gray',
			display : isShow
		}

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
				<br/>
				<div className="pull-right">
					<T.span text="Total Rows"/>: {rows.length}
				</div>
			</ButtonToolbar>

			<h1><T.span text="CDRs"/></h1>
			<div>
				<div style={{padding: "5px", display: _this.state.hiddendiv}} className="pull-right">
					<input type="date" defaultValue={sevenDaysBeforeToday} ref={(input) => { _this.startDate = input; }}/> -&nbsp;
					<input type="date" defaultValue={today} ref={(input) => { _this.endDate = input; }}/> &nbsp;
					<T.span text="CID Number"/><input ref={(input) => { _this.cidNumber = input; }}/> &nbsp;
					<T.span text="Dest Number"/><input ref={(input) => { _this.destNumber = input; }}/> &nbsp;
					<T.button text="Search" onClick={this.handleSearch}/>
				</div>

				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="CID Name"/></th>
					<th><T.span text="CID Number"/></th>
					<th><T.span text="Dest Number"/></th>
					<th><T.span text="Context"/></th>
					<th><T.span text="Start"/></th>
					<th><T.span text="Answer"/></th>
					<th><T.span text="End"/></th>
					<th><T.span text="Duration"/></th>
					<th><T.span text="Bill Sec"/></th>
					<th><T.span text="Cause"/></th>
					<th><T.span text="Account Code"/></th>
					<th><T.span text="Detail"/></th>
				</tr>
				{rows}
				<tr>
					<td colSpan="11" style={{textAlign: "right"}}>
						<T.span text="Total Rows"/>: {rows.length}
					</td>
				</tr>
				</tbody>
				</table>
			</div>
			<div style={{textAlign: "center"}}>
				<img style={loadSpinner} src="assets/img/loading.gif"/>
			</div>	
		</div>
	}
};

export {CDRPage, CDRsPage};
