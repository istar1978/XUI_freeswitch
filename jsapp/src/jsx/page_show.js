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
import verto from './verto/verto';

class ShowFSApplication extends React.Component{
	render () {
		var i = 0;
		var rows = this.props.rows.map(function(row) {
			return <tr key={i++}>
				<td>{row.name }</td>
				<td>{row.description }</td>
				<td>{row.syntax }</td>
				<td>{row.ikey }</td>
			</tr>
		});

		return <div><h1>Applications</h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th>Name</th>
					<th>Description</th>
					<th>Syntax</th>
					<th>iKey</th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

class ShowFSAPI extends React.Component{
	render () {
		var i = 0;
		var rows = this.props.rows.map(function(row) {
			return <tr key={i++}>
				<td>{row.name }</td>
				<td>{row.description }</td>
				<td>{row.syntax }</td>
				<td>{row.ikey }</td>
			</tr>
		});

		return <div><h1>{this.props.title}</h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th>Name</th>
					<th>Description</th>
					<th>Syntax</th>
					<th>iKey</th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

class ShowFSComplete extends React.Component{
	render () {
		var i = 0;
		var rows = this.props.rows.map(function(row) {
			return <tr key={i++}>
				<td>{row.sticky}</td>
				<td>{row.a1}</td>
				<td>{row.a2}</td>
				<td>{row.a3}</td>
				<td>{row.a4}</td>
				<td>{row.a5}</td>
				<td>{row.a6}</td>
				<td>{row.a7}</td>
				<td>{row.a8}</td>
				<td>{row.a9}</td>
				<td>{row.a10}</td>
				<td>{row.hosthame}</td>
			</tr>
		});

		return <div><h1>{this.props.title}</h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th>Sticky</th>
					<th>A1</th>
					<th>A2</th>
					<th>A3</th>
					<th>A4</th>
					<th>A5</th>
					<th>A6</th>
					<th>A7</th>
					<th>A8</th>
					<th>A9</th>
					<th>A10</th>
					<th>Hostname</th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

class ShowFSModule extends React.Component{
	render () {
		var i = 0;
		var rows = this.props.rows.map(function(row) {
			return <tr key={i++}>
				<td>{row.type }</td>
				<td>{row.name }</td>
				<td>{row.ikey }</td>
				<td>{row.filename }</td>
			</tr>
		});

		return <div><h1>{this.props.title}</h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th>Type</th>
					<th>Name</th>
					<th>iKey</th>
					<th>FileName</th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

class ShowFSRegistration extends React.Component{
	render () {
		var rows = this.props.rows.map(function(row) {
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

		return <div><h1>{this.props.title}</h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th>Reg User</th>
					<th>Realm</th>
					<th>Expires</th>
					<th>Network IP</th>
					<th>Network Port</th>
					<th>Network Proto</th>
					<th>Hostname</th>
					<th>Metadata</th>
					<th>Token / Url</th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

class ShowFSTasks extends React.Component{
	render () {
		var rows = this.props.rows.map(function(row) {
			return <tr key={row.task_id}>
				<td>{row.task_id }</td>
				<td>{row.task_desc }</td>
				<td>{row.task_group }</td>
				<td>{row.task_sql_manager }</td>
				<td>{row.hostname }</td>
			</tr>
		});

		return <div><h1>{this.props.title}</h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th>Task ID</th>
					<th>Task Desc</th>
					<th>Task Group</th>
					<th>Task SQL Manager</th>
					<th>HostName</th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

class ShowFSAliases extends React.Component{
	render () {
		var i = 0;
		var rows = this.props.rows.map(function(row) {
			return <tr key={i++}>
				<td>{row.alias }</td>
				<td>{row.command }</td>
				<td>{row.hostname }</td>
				<td>{row.sticky }</td>
			</tr>
		});

		return <div><h1>{this.props.title}</h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th>Alias</th>
					<th>Command</th>
					<th>HostName</th>
					<th>Sticky</th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

class ShowFSCommon extends React.Component{
	render () {
		var i = 0;
		var rows = this.props.rows.map(function(row) {
			return <tr key={i++}>
				<td>{row.type }</td>
				<td>{row.name }</td>
				<td>{row.ikey }</td>
			</tr>
		});

		return <div><h1>{this.props.title}</h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th>Type</th>
					<th>Name</th>
					<th>iKey</th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>
		</div>
	}
};

class ShowFSPage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {rows: []};
	}

	componentDidMount () {
		var _this = this;

		verto.showFSAPI(this.props.what, function(data) {
			var msg = $.parseJSON(data.message);
			if (msg.row_count === 0) {
				_this.setState({rows: []});
			} else {
				console.log(msg.rows);
				_this.setState({rows: msg.rows});
			};
		});
	}

	render () {
		if (this.props.what == "application") {
			return <ShowFSApplication rows = {this.state.rows} title = {this.props.title}/>
		} else if (this.props.what == "api") {
			return <ShowFSAPI rows = {this.state.rows} title = {this.props.title}/>
		} else if (this.props.what == "complete") {
			return <ShowFSComplete rows = {this.state.rows} title = {this.props.title}/>
		} else if (this.props.what == "modules") {
			return <ShowFSModule rows = {this.state.rows} title = {this.props.title}/>
		} else if (this.props.what == "registrations") {
			return <ShowFSRegistration rows = {this.state.rows} title = {this.props.title}/>
		} else if (this.props.what == "tasks") {
			return <ShowFSTasks rows = {this.state.rows} title = {this.props.title}/>
		} else if (this.props.what == "aliases") {
			return <ShowFSAliases rows = {this.state.rows} title = {this.props.title}/>
		} else {
			return <ShowFSCommon rows = {this.state.rows} title = {this.props.title}/>
		}
	}
};

export default ShowFSPage;
