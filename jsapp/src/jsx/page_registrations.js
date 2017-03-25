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
import verto from './verto/verto';

class RegistrationsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {rows: []};
		this.handleControlClick = this.handleControlClick.bind(this);
	}

	handleControlClick (e) {
		this.refreshRegistrations();
	}

	componentWillMount () {
	}

	componentWillUnmount () {
	}


	componentDidMount () {
		this.refreshRegistrations();
	}

	refreshRegistrations () {
		var _this = this;
		verto.showFSAPI("registrations", function(data) {
			var msg = $.parseJSON(data.message);

			if (msg.row_count === 0) {
				_this.setState({rows: []});
			} else {
				console.log(msg.rows);
				_this.setState({rows: msg.rows});
			};
		});
	}

	handleFSEvent (v, e) {
	}

	render () {
		var rows = this.state.rows.map(function(row) {
			return <tr key={row.reg_user + row.token}>
				<td>{row.reg_user }</td>
				<td>{row.realm }</td>
				<td>{row.expires }</td>
				<td>{row.network_ip }</td>
				<td>{row.network_port }</td>
				<td>{row.network_proto }</td>
				<td>{row.hostname }</td>
				<td>{row.metadata }</td>
				<td>{row.token }</td>
			</tr>
		});

		return <div>
			<ButtonToolbar className="pull-right">
				<Button onClick={this.handleControlClick} data="refresh">
					<i className="fa fa-refresh" aria-hidden="true" data="refresh"></i>&nbsp;
					<T.span data="refresh" text="Refresh" />
				</Button>
			</ButtonToolbar>


			<h1><T.span text="Registrations"/></h1>
			<table className="table">
			<tbody>
			<tr>
				<th><T.span text="Reg User"/></th>
				<th><T.span text="Realm"/></th>
				<th><T.span text="Expires"/></th>
				<th><T.span text="Network IP"/></th>
				<th><T.span text="Network Port"/></th>
				<th><T.span text="Network Proto"/></th>
				<th><T.span text="Hostname"/></th>
				<th><T.span text="Metadata"/></th>
				<th><T.span text="URL"/></th>
			</tr>
			{rows}
			</tbody>
			</table>
		</div>
	}
};

export default RegistrationsPage;
