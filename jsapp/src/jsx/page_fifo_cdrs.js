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

var FifoCDRsPage = React.createClass({
	getInitialState: function() {
		return {rows: []};
	},

	handleClick: function(x) {
	},

	handleControlClick: function(e) {
		console.log("clicked", e.target);
	},

	componentWillMount: function() {
	},

	componentWillUnmount: function() {
	},

	componentDidMount: function() {
		const _this = this;

		$.getJSON("/api/fifo_cdrs", function(fifocdrs) {
			_this.setState({rows: fifocdrs});
		})
	},

	fifocdrsQuery: function(){
		const _this = this;

		$.getJSON("/api/fifo_cdrs/" + num, function(fifocdrs) {
			_this.setState({rows: fifocdrs});
		})

	},

	render: function() {
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
		})

		return <div>
			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				<Button><T.span onClick={this.handleControlClick} text="Search"/></Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h1><T.span text="FIFO CDRs"/></h1>
			<div>
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
});

export default FifoCDRsPage;
