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
import { Modal, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Row, Col } from 'react-bootstrap';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';

class SettingEventSocket extends React.Component {
	constructor(props) {
		super(props);

		this.state = {editable: false, rows:[]}
	}

	handleChange(obj) {
		const _this = this;
		const id = Object.keys(obj)[0];
		const value = Object.values(obj)[0];

		this.state.rows.map(function(row) {
			if (row.id == id) {
				localStorage.setItem(row.k, value);
			}
		});

		console.log("change", obj);
	}

	componentDidMount() {
		const _this = this;

		$.getJSON("/api/event", "", function(data) {
			_this.setState({rows: data});
		}, function(e) {
			console.log("get EventSocket ERR");
		});

	}

	handleToggleParam(e) {
		const _this = this;
		const data = e.target.getAttribute("data");

		$.ajax({
			type: "PUT",
			url: "/api/event/" + data,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({action: "toggle"}),
			success: function (param) {
				console.log("success!!!!", param);
				const eventsocket_rows = _this.state.rows.map(function(eventsocket_row) {
					if (eventsocket_row.id == data) {
						eventsocket_row.disabled = param.disabled;
					}
					return eventsocket_row;
				});
				_this.state.eventsocket_rows = eventsocket_rows;
				_this.setState({eventsocket_rows: _this.state.eventsocket_rows});
			},
			error: function(msg) {
				console.error("toggle params", msg);
			}
		});
	}

	render() {
		const _this = this;


		const rows = this.state.rows.map((eventsocket_row) => {
			const disabled_class = dbfalse(eventsocket_row.disabled) ? "" : "disabled";
			return <Row key={eventsocket_row.k}>
				<Col sm={2}><T.span text={eventsocket_row.k}/></Col>
				<Col sm={2}><Button onClick={_this.handleToggleParam} data={eventsocket_row.id}>{dbfalse(eventsocket_row.disabled) ? "Yes" : "No"}</Button></Col>
				<Col>
					<RIEInput value={eventsocket_row.v} change={_this.handleChangeEventSocket.bind(_this)}
						propName={eventsocket_row.id}
						className={_this.state.highlight ? "editable" : "editable2"}
						validate={_this.isStringAcceptable}
						classLoading="loading"
						classInvalid="invalid"/>
				</Col>
			</Row>
		});

		return <div>
			<h2><T.span text="EventSocket Settings"/></h2>
			{rows}
		</div>;
	}
}

export default SettingEventSocket;
