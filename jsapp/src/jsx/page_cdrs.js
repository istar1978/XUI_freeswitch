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

class CDRsPage extends React.Component {
	constructor(props) {
		super(props);
		var theRows = localStorage.getItem("theRows");
    	if (theRows == null) {
	    	var r = 10000;
	    	localStorage.setItem("theRows", r);
     	}
     	this.state = {rows: [], query_visible: false};
     	this.handleQuery = this.handleQuery.bind(this);
     	this.handleSearch = this.handleSearch.bind(this);
     	this.handleMore = this.handleMore.bind(this);
	}

	handleClick (x) {
	}

	handleControlClick (e) {
		console.log("clicked", e.target);
	}

	handleMore (e){
		e.preventDefault();
		this.setState({query_visible: !this.state.query_visible})
	}

	handleSearch (e) {
		const _this = this;
		const qs = "startDate=" + this.startDate.value +
			"&endDate=" + this.endDate.value +
			"&cidNumber=" + this.cidNumber.value +
			"&destNumber=" + this.destNumber.value +
			"&id=2";

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

		$.getJSON("/api/cdrs?id=0", function(cdrs) {
			_this.setState({rows: cdrs});
		})
	}

	handleQuery (e) {
		var _this = this;
		var data = parseInt(e.target.getAttribute("data"));

		e.preventDefault();

		$.getJSON("/api/cdrs?last=" + data + "&id=1", function(cdrs) {
			_this.setState({rows: cdrs});
		})
	}

	render () {
		var _this = this;

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
			</tr>
		})

		return <div>
			<ButtonToolbar className="pull-right">
				<T.span text="Last"/> &nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", path: 7}} data="7" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", path: 15}} data="15" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", path: 30}} data="30" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", path: 60}} data="60" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleQuery} text={{key:"days", path: 90}} data="90" href="#"/>&nbsp;|&nbsp;
				<T.a onClick={this.handleMore} text="More" data="more" href="#"/>...
			</ButtonToolbar>

			<h1><T.span text="CDRs"/></h1>
			<div>
				{this.state.query_visible && <div style={{padding: "5px"}} className="pull-right">
					<input type="date" defaultValue="2017-01-01" ref={(input) => { _this.startDate = input; }}/> -&nbsp;
					<input type="date" defaultValue="2017-02-02" ref={(input) => { _this.endDate = input; }}/> &nbsp;
					<T.span text="CID Number"/><input ref={(input) => { _this.cidNumber = input; }}/> &nbsp;
					<T.span text="Dest Number"/><input ref={(input) => { _this.destNumber = input; }}/> &nbsp;
					<T.button text="Search" onClick={this.handleSearch}/>
				</div>}

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
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

export default CDRsPage;
