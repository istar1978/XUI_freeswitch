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
				<td>{row.channel_uuid}</td>
				<td>{row.fifo_name}</td>
				<td>{row.ani}</td>
				<td>{row.dest_number}</td>
				<td>{row.bridged_number}</td>
				<td>{xdatetime(row.start_epoch)}</td>
				<td>{xdatetime(row.bridge_epoch)}</td>
				<td>{xdatetime(row.end_epoch)}</td>
			</tr>
		});

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
					<input type="date" defaultValue="2017-01-01" ref={(input) => { _this.startDate = input; }}/> -&nbsp;
					<input type="date" defaultValue="2017-02-02" ref={(input) => { _this.endDate = input; }}/> &nbsp;
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

export default FifoCDRsPage;
