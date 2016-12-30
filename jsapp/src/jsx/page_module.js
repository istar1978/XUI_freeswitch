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
import { Modal, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Radio, Col } from 'react-bootstrap';
import { Link } from 'react-router';
// http://kaivi.github.io/riek/
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek'
import { EditControl } from './xtools'

class ModulePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {module: {}, edit: false, params:[]};

		// This binding is necessary to make `this` work in the callback
		this.handleToggleParam = this.handleToggleParam.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.toggleHighlight = this.toggleHighlight.bind(this);
		this.handleSort = this.handleSort.bind(this);
	}

	handleToggleParam(e) {
		const _this = this;
		const data = e.target.getAttribute("data");

		$.ajax({
			type: "PUT",
			url: "/api/sip_module/" + this.state.module.id + "/params/" + data,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({action: "toggle"}),
			success: function (param) {
				// console.log("success!!!!", param);
				const params = _this.state.module.params.map(function(p) {
					if (p.id == data) {
						p.disabled = param.disabled;
					}
					return p;
				});
				_this.state.module.params = params;
				_this.setState({module: _this.state.module});
			},
			error: function(msg) {
				console.error("toggle params", msg);
			}
		});
	}

	handleChange(obj) {
		const _this = this;
		const id = Object.keys(obj)[0];

		console.log("change", obj);

		$.ajax({
			type: "PUT",
			url: "/api/module/" + this.state.module.id + "/params/" + id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({v: obj[id]}),
			success: function (param) {
				console.log("success!!!!", param);
				_this.state.module.params = _this.state.module.params.map(function(p) {
					if (p.id == id) {
						return param;
					}
					return p;
				});
				_this.setState({module: _this.state.module});
			},
			error: function(msg) {
				console.error("update params", msg);
				_this.setState({module: _this.state.module});
			}
		});
	}

	toggleHighlight() {
		this.setState({highlight: !this.state.highlight});
	}

	isStringAcceptable() {
		return true;
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/module/" + this.props.params.id, "", function(data) {
			_this.setState({module: data});
		}, function(e) {
			console.log("get module ERR");
		});
	}

	handleSort(e){
		var _this = this;
		const module = _this.state.module;
		var params = _this.state.module.params;
		if (params[0].disabled == 0) {
			params.sort(function(b,a){
			return a.disabled - b.disabled;
			})
		} else{
			params.sort(function(a,b){
			return a.disabled - b.disabled;
			})
		};
		
		_this.setState({module: module, edit: false});
	}

	render() {
		const module = this.state.module;
		const _this = this;
		let save_btn = "";
		let err_msg = "";
		let params = <tr></tr>;

		if (this.state.module.params && Array.isArray(this.state.module.params)) {
			// console.log(this.state.module.params)
			params = this.state.module.params.map(function(param) {
				const disabled_class = dbfalse(param.disabled) ? "" : "disabled";

				return <tr key={param.id} className={disabled_class}>
					<td>{param.k}</td>
					<td><RIEInput value={param.v} change={_this.handleChange}
						propName={param.id}
						className={_this.state.highlight ? "editable" : ""}
						validate={_this.isStringAcceptable}
						classLoading="loading"
						classInvalid="invalid"/>
					</td>
					<td><Button onClick={_this.handleToggleParam} data={param.id}>{dbfalse(param.disabled) ? "Yes" : "No"}</Button></td>
				</tr>
			});
		}

		return <div>
			<ButtonGroup className="controls">
				<Button><T.span onClick={this.toggleHighlight} text="Edit"/></Button>
			</ButtonGroup>

			<h2>Params</h2>
			<table className="table">
				<tbody>
				<tr>
					<th>Name</th>
					<th>Value</th>
					<th onClick={this.handleSort.bind(this)}>Enabled</th>
				</tr>
				{params}
				</tbody>
			</table>
		</div>
	}
}

export {ModulePage};
