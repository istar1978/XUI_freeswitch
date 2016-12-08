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
import Dropzone from 'react-dropzone';
import { EditControl } from './xtools'

class NewMediaFile extends React.Component {
	propTypes: {handleNewMediaFileAdded: React.PropTypes.func}

	constructor(props) {
		super(props);

		this.last_id = 0;
		this.state = {errmsg: ''};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var profile = form2json('#newMediaFileForm');

		if (!profile.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/sip_profiles",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(profile),
			success: function (obj) {
				profile.id = obj.id;
				_this.props["data-handleNewMediaFileAdded"](profile);
			},
			error: function(msg) {
				console.error("sip_profile", msg);
			}
		});
	}

	onDrop (acceptedFiles, rejectedFiles) {
		console.log('Accepted files: ', acceptedFiles);
		console.log('Rejected files: ', rejectedFiles);

		let data = new FormData()
		data.append('file', acceptedFiles[0])

		fetch('/api/upload', {
			method: 'POST',
			body: data
		})
	}

	render() {
		console.log(this.props);

		const props = Object.assign({}, this.props);
		const profiles = props.profiles;
		delete props.profiles;

		const profiles_options = profiles.map(profile => {
			return <option value={profile.id} key={profile.id}>Profile[{profile.name}]</option>
		});

		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New Media File" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newMediaFileForm">
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="name" placeholder="profile1" /></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description"/></Col>
					<Col sm={10}><FormControl type="input" name="description" placeholder="Description ..." /></Col>
				</FormGroup>

				<FormGroup controlId="formFile">
					<Col componentClass={ControlLabel} sm={2}><T.span text="File"/></Col>
					<Col sm={10}>
						<Dropzone onDrop={this.onDrop}>
							<div>Try dropping some files here, or click to select files to upload.</div>
						</Dropzone>
					</Col>
				</FormGroup>

				<FormGroup>
					<Col smOffset={2} sm={10}>
						<Button type="button" bsStyle="primary" onClick={this.handleSubmit}>
							<i className="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;
							<T.span text="Save" />
						</Button>
						&nbsp;&nbsp;<T.span className="danger" text={this.state.errmsg}/>
					</Col>
				</FormGroup>
			</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={this.props.onHide}>
					<i className="fa fa-times" aria-hidden="true"></i>&nbsp;
					<T.span text="Close" />
				</Button>
			</Modal.Footer>
		</Modal>;
	}
}

class MediaFilePage extends React.Component {
	propTypes: {handleNewMediaFileAdded: React.PropTypes.func}

	constructor(props) {
		super(props);

		this.state = {profile: {}, edit: false};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleToggleParam = this.handleToggleParam.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.toggleHighlight = this.toggleHighlight.bind(this);
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var file = form2json('#newMediaFileForm');

		if (!file.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "PUT",
			url: "/api/media_files/" + file.id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(profile),
			success: function () {
				profile.params = _this.state.profile.params;
				_this.setState({profile: profile, edit: false});
				notify(<T.span text={{key:"Saved at", time: Date()}}/>);
			},
			error: function(msg) {
				console.error("route", msg);
			}
		});
	}

	handleControlClick(e) {
		this.setState({edit: !this.state.edit});
	}

	handleToggleParam(e) {
		const _this = this;
		const data = e.target.getAttribute("data");

		$.ajax({
			type: "PUT",
			url: "/api/media_files/" + this.state.profile.id + "/params/" + data,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({action: "toggle"}),
			success: function (param) {
				// console.log("success!!!!", param);
				const params = _this.state.profile.params.map(function(p) {
					if (p.id == data) {
						p.disabled = param.disabled;
					}
					return p;
				});
				_this.state.profile.params = params;
				_this.setState({profile: _this.state.profile});
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
			url: "/api/media_files/" + this.state.profile.id + "/params/" + id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({v: obj[id]}),
			success: function (param) {
				console.log("success!!!!", param);
				_this.state.profile.params = _this.state.profile.params.map(function(p) {
					if (p.id == id) {
						return param;
					}
					return p;
				});
				_this.setState({profile: _this.state.profile});
			},
			error: function(msg) {
				console.error("update params", msg);
				_this.setState({profile: _this.state.profile});
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
		$.getJSON("/api/media_files/" + this.props.params.id, "", function(data) {
			_this.setState({profile: data});
		}, function(e) {
			console.log("get profile ERR");
		});
	}

	render() {
		const profile = this.state.profile;
		const _this = this;
		let save_btn = "";
		let err_msg = "";
		let params = <tr></tr>;

		if (this.state.profile.params && Array.isArray(this.state.profile.params)) {
			// console.log(this.state.profile.params)
			params = this.state.profile.params.map(function(param) {
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

		if (this.state.edit) {
			save_btn = <Button><T.span onClick={this.handleSubmit} text="Save"/></Button>
		}

		return <div>
			<ButtonGroup className="controls">
				{ save_btn }
				<Button><T.span onClick={this.handleControlClick} text="Edit"/></Button>
			</ButtonGroup>

			<h1>{profile.name} <small>{profile.extn}</small></h1>
			<hr/>

			<Form horizontal id="newMediaFileForm">
				<input type="hidden" name="id" defaultValue={profile.id}/>
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="name" defaultValue={profile.name}/></Col>
				</FormGroup>

				<FormGroup controlId="formDescription">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="description" defaultValue={profile.description}/></Col>
				</FormGroup>
			</Form>

			<ButtonGroup className="controls">
				<Button><T.span onClick={this.toggleHighlight} text="Edit"/></Button>
			</ButtonGroup>

			<h2>Params</h2>
			<table className="table">
				<tbody>
				<tr>
					<th>Name</th>
					<th>Value</th>
					<th>Enabled</th>
				</tr>
				{params}
				</tbody>
			</table>
		</div>
	}
}

class MediaFilesPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { formShow: false, rows: [], danger: false};

		// This binding is necessary to make `this` work in the callback
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleControlClick(e) {
		var data = e.target.getAttribute("data");
		console.log("data", data);

		if (data == "new") {
			// this.setState({ formShow: true});
			this.dropzone.open();
		}
	}

	handleDelete(e) {
		var id = e.target.getAttribute("data-id");
		console.log("deleting id", id);
		var _this = this;

		if (!this.state.danger) {
			var c = confirm(T.translate("Confirm to Delete ?"));

			if (!c) return;
		}

		$.ajax({
			type: "DELETE",
			url: "/api/sip_profiles/" + id,
			success: function () {
				console.log("deleted")
				var rows = _this.state.rows.filter(function(row) {
					return row.id != id;
				});

				_this.setState({rows: rows});
			},
			error: function(msg) {
				console.error("route", msg);
			}
		});
	}

	handleClick(x) {
	}

	componentWillMount() {
	}

	componentWillUnmount() {
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/media_files", "", function(data) {
			_this.setState({rows: data});
		}, function(e) {
			console.log("get media_files ERR");
		});
	}

	handleFSEvent(v, e) {
	}

	handleMediaFileAdded(row) {
		var rows = this.state.rows;
		rows.push(row);
		this.setState({rows: rows, formShow: false});
	}

	onDrop (acceptedFiles, rejectedFiles) {
		console.log('Accepted files: ', acceptedFiles);
		console.log('Rejected files: ', rejectedFiles);

		let data = new FormData()

		for (var i = 0; i < acceptedFiles.length; i++) {
			data.append('file', acceptedFiles[i])
		}

		fetch('/api/upload', {
			method: 'POST',
			body: data
		})
	}

	render() {
		const formClose = () => this.setState({ formShow: false });
		const toggleDanger = () => this.setState({ danger: !this.state.danger });
	    const danger = this.state.danger ? "danger" : "";

		const _this = this;

		const rows = this.state.rows.map(function(row) {
			const disabled_class = row.disabled == "false" ? "" : "disabled";

			return <tr key={row.id} className={disabled_class}>
					<td>{row.id}</td>
					<td><Link to={`/settings/sip_profiles/${row.id}`}>{row.name}</Link></td>
					<td>{row.description}</td>
					<td>{row.disabled ? "Yes" : "No"}</td>
					<td></td>
					<td><T.a onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger}/></td>
			</tr>;
		})

		return <Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop} className="dropzone" activeClassName="dropzone_active" disableClick="true"><div>
			<div className="controls">
				<Button>
					<i className="fa fa-plus" aria-hidden="true"></i>&nbsp;
					<T.span onClick={this.handleControlClick} data="new" text="New" />
				</Button>
			</div>

			<h1><T.span text="Media Files"/> <small><T.span text="Drag and drop files here to upload"/></small></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Name"/></th>
					<th><T.span text="Type"/></th>
					<th><T.span text="Description"/></th>
					<th><T.span text="Size"/></th>
					<th><T.span text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>

			<NewMediaFile show={this.state.formShow} onHide={formClose}
				profiles = {this.state.rows}
				data-handleNewMediaFileAdded={this.handleMediaFileAdded.bind(this)}/>
		</div></Dropzone>
	}
}

export {MediaFilesPage, MediaFilePage};
