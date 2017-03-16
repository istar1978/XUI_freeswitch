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
 * Mariah Yang <yangxiaojin@x-y-t.cn>
 * Portions created by the Initial Developer are Copyright (C)
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Mariah Yang <yangxiaojin@x-y-t.cn>
 *
 *
 */

'use strict';

import React from 'react';
import T from 'i18n-react';
import verto from './verto/verto';
import { Link } from 'react-router';
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Col } from 'react-bootstrap';
import { EditControl } from './xtools'

class NewMcast extends React.Component {
	constructor(props) {
		super(props);

		this.state = {errmsg: '', codec_name: [], sample_rate: []};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCodecNameChange = this.handleCodecNameChange.bind(this);
	}

	handleCodecNameChange(e) {
		const _this = this;

		switch(e.target.value) {
			case 'PCMU':
				$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE&k=8000", function(data) {
					_this.setState({sample_rate: data});
				});
				break;
			case 'PCMA':
				$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE&k=8000", function(data) {
					_this.setState({sample_rate: data});
				});
				break;
			case 'G722':
				$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE&k=16000", function(data) {
					_this.setState({sample_rate: data});
				});
				break;
			case 'CELT':
				$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE", function(data) {
					_this.setState({sample_rate: data});
				});
				break;
			default:
				break;
		}
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var mcast = form2json('#newMcastForm');
		console.log("mcast", mcast);

		if (!mcast.name || !mcast.source || !mcast.codec_ms || !mcast.channels || !mcast.maddress || !mcast.mport) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/mcasts",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(mcast),
			success: function (obj) {
				mcast.id = obj.id;
				_this.props.handleNewmcastAdded(mcast);
			},
			error: function(msg) {
				console.error("mcast", msg);
			}
		});
	}

	componentDidMount() {
		const _this = this;

		$.getJSON("/api/dicts?realm=MCAST_CODEC_NAME", function(data) {
			_this.setState({codec_name: data});
		});

		$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE&k=8000", function(data) {
			_this.setState({sample_rate: data});
		});
	}

	render() {
		const props = Object.assign({}, this.props);
		delete props.handleNewmcastAdded;

		return <Modal {...props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New mcast" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newMcastForm">
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="name" placeholder="multicast name" /></Col>
				</FormGroup>

				<FormGroup controlId="formSource">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Source" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="source" placeholder="local_stream://test" /></Col>
				</FormGroup>

				<FormGroup controlId="formCodecName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Codec Name"/></Col>
					<Col sm={10}>
						<FormControl componentClass="select" name="codec_name" onChange={this.handleCodecNameChange}>
							{this.state.codec_name.map(function(c) {
								return <option key={c.id}>{c.k}</option>;
							})}
						</FormControl>
					</Col>
				</FormGroup>

				<FormGroup controlId="formSampleRate">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Sample Rate" /></Col>
					<Col sm={10}>
						<FormControl componentClass="select" name="sample_rate">
							{this.state.sample_rate.map(function(t) {
								return <option key={t.id} value={t.k}>{T.translate(t.k)}</option>;
							})}
						</FormControl>
					</Col>
				</FormGroup>

				<FormGroup controlId="formCodecMs">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Codec Ms" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="codec_ms" placeholder="20"/></Col>
				</FormGroup>

				<FormGroup controlId="formChannels">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Channels" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="channels" placeholder="1"/></Col>
				</FormGroup>

				<FormGroup controlId="formMaddress">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Multicast Address" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="maddress" placeholder="224.222.222.222"/></Col>
				</FormGroup>

				<FormGroup controlId="formMport">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Multicast Port" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="mport" placeholder="4598"/></Col>
				</FormGroup>

				<FormGroup controlId="formEnable">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Enabled" /></Col>
					<Col sm={10}>
						<FormControl componentClass="select" name="enable">
							<option value="true">true</option>
							<option value="false">false</option>
						</FormControl>
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

class McastPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {mcast: {}, edit: false, enable: [], codec_name: [],
			sample_rate: []
		};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleCodecNameChange = this.handleCodecNameChange.bind(this);
	}

	handleCodecNameChange(e) {
		const _this = this;

		switch(e.target.value) {
			case 'PCMU':
				$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE&k=8000", function(data) {
					_this.setState({sample_rate: data});
				});
				break;
			case 'PCMA':
				$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE&k=8000", function(data) {
					_this.setState({sample_rate: data});
				});
				break;
			case 'G722':
				$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE&k=16000", function(data) {
					_this.setState({sample_rate: data});
				});
				break;
			case 'CELT':
				$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE", function(data) {
					_this.setState({sample_rate: data});
				});
				break;
			default:
				break;
		}
	}

	handleSubmit(e) {
		var _this = this;

		console.log("submit...");
		var mcast = form2json('#newMcastForm');
		console.log("mcast", mcast);

		if (!mcast.name || !mcast.source || !mcast.codec_ms || !mcast.channels || !mcast.maddress || !mcast.mport) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/mcasts/" + mcast.id,
			headers: {"X-HTTP-Method-Override": "PUT"},
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(mcast),
			success: function () {
				_this.setState({mcast: mcast, edit: false})
				_this.handleCodecNameChange({target: {value: _this.state.mcast.codec_name}});
				notify(<T.span text={{key:"Saved at", time: Date()}}/>);
			},
			error: function(msg) {
				console.error("mcast", msg);
			}
		});
	}

	handleControlClick(e) {
		this.setState({edit: !this.state.edit});
	}

	componentDidMount() {
		var _this = this;

		$.getJSON("/api/dicts?realm=MCAST_CODEC_NAME", function(data) {
			_this.setState({codec_name: data});
		});

		$.getJSON("/api/dicts?realm=MCAST_SAMPLE_RATE&k=8000", function(data) {
			_this.setState({sample_rate: data});
		});

		$.getJSON("/api/mcasts/" + this.props.params.id, "", function(data) {
			_this.setState({mcast: data});
			console.log("mcast", data);
		}, function(e) {
			console.log("get mcast ERR");
		});
	}

	render() {
		const mcast = this.state.mcast;
		let save_btn = "";
		let err_msg = "";

		if (this.state.edit) {
			save_btn = <Button><T.span onClick={this.handleSubmit} text="Save"/></Button>
			if (this.state.errmsg) {
				err_msg  = <Button><T.span text={this.state.errmsg} className="danger"/></Button>
			}
		}

		const codec_name_options = this.state.codec_name.map(function(row) {
			return [row.k, row.k];
		});

		const sample_rate_options = this.state.sample_rate.map(function(row) {
			return [row.k, row.k];
		});

		const enable_options = [['true', 'true'], ['false', 'false']];

		return <div>
			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				{err_msg} { save_btn }
				<Button><T.span onClick={this.handleControlClick} text="Edit"/></Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h1><T.span text="Multicast"/> <small>{mcast.name}</small></h1>
			<hr/>

			<Form horizontal id="newMcastForm">
				<input type="hidden" name="id" defaultValue={mcast.id}/>
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="name" defaultValue={mcast.name}/></Col>
				</FormGroup>

				<FormGroup controlId="formSource">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Source" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="source" defaultValue={mcast.source}/></Col>
				</FormGroup>

				<FormGroup controlId="formCodecName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Codec Name"/></Col>
					<Col sm={10}>
						<EditControl edit={this.state.edit} componentClass="select" name="codec_name" options={codec_name_options} text={T.translate(mcast.codec_name)} defaultValue={mcast.codec_name} onChange={this.handleCodecNameChange}/>
					</Col>
				</FormGroup>

				<FormGroup controlId="formSampleRate">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Sample Rate"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} componentClass="select" name="sample_rate" options={sample_rate_options} text={T.translate(mcast.sample_rate)} defaultValue={mcast.sample_rate}/></Col>
				</FormGroup>

				<FormGroup controlId="formCodecMs">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Codec Ms" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="codec_ms" defaultValue={mcast.codec_ms}/></Col>
				</FormGroup>

				<FormGroup controlId="formChannels">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Channels" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="channels" defaultValue={mcast.channels}/></Col>
				</FormGroup>

				<FormGroup controlId="formMaddress">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Multicast Address" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="maddress" defaultValue={mcast.maddress}/></Col>
				</FormGroup>

				<FormGroup controlId="formMport">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Multicast Port" className="mandatory"/></Col>
					<Col sm={10}><EditControl edit={this.state.edit} name="mport" defaultValue={mcast.mport}/></Col>
				</FormGroup>

				<FormGroup controlId="formEnabled">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Enabled"/></Col>
					<Col sm={10}>
						<EditControl edit={this.state.edit} componentClass="select" name="enable" options={enable_options} text={T.translate(mcast.enable)} defaultValue={mcast.enable}/>

					</Col>
				</FormGroup>
				<FormGroup controlId="formSave">
					<Col componentClass={ControlLabel} sm={2}></Col>
					<Col sm={10}>{save_btn}</Col>
				</FormGroup>
			</Form>
		</div>
	}
}

class McastsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {formShow: false, rows: [], danger: false};
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}


	handleControlClick(e) {
		var data = e.target.getAttribute("data");
		console.log("data", data);

		if (data == "new") {
			this.setState({ formShow: true});
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
			url: "/api/mcasts/" + id,
			success: function () {
				console.log("deleted")
				var rows = _this.state.rows.filter(function(row) {
					return row.id != id;
				});

				_this.setState({rows: rows});
			},
			error: function(msg) {
				console.error("mcast", msg);
			}
		});
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/mcasts", "", function(data) {
			var rows = [];
			for (var i = 0; i < data.length; i++) {
				rows.push(data[i]);
			}

			_this.setState({rows: rows});
		}, function(e) {
			console.log("get mcasts ERR");
		});
	}

	handleMcastAdded(mcast) {
		var rows = this.state.rows;
		rows.unshift(mcast);
		this.setState({rows: rows, formShow: false});
    }

	render() {
		let formClose = () => this.setState({ formShow: false });
		let toggleDanger = () => this.setState({ danger: !this.state.danger });
		let hand = { cursor: "pointer"};
	    var danger = this.state.danger ? "danger" : "";
	    var _this = this;
		var rows = [];
		this.state.rows.forEach(function(row) {
			rows.push(<tr key={row.id}>
					<td><Link to={`/settings/mcasts/${row.id}`}>{row.name}</Link></td>
					<td>{row.source}</td>
					<td>{row.codec_name}</td>
					<td>{row.codec_ms}</td>
					<td>{row.channels}</td>
					<td>{row.maddress}</td>
					<td>{row.mport}</td>
					<td>{row.sample_rate}</td>
					<td>{row.enable}</td>
					<td><T.a style={hand} onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger}/></td>
			</tr>);
		})

		return <div>

			<ButtonToolbar className="pull-right">
				<ButtonGroup>
					<Button onClick={this.handleControlClick} data="new">
						<i className="fa fa-plus" aria-hidden="true" onClick={this.handleControlClick} data="new"></i>&nbsp;
						<T.span onClick={this.handleControlClick} data="new" text="New" />
					</Button>
				</ButtonGroup>
			</ButtonToolbar>

			<h1><T.span text="Multicasts"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="Name"/></th>
					<th><T.span text="Source"/></th>
					<th><T.span text="Codec Name"/></th>
					<th><T.span text="Codec Ms"/></th>
					<th><T.span text="Channels"/></th>
					<th><T.span text="Multicast Address"/></th>
					<th><T.span text="Multicast Port"/></th>
					<th><T.span text="Sample Rate"/></th>
					<th><T.span text="Enabled"/></th>
					<th><T.span style={hand} text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>

			<NewMcast show={this.state.formShow} onHide={formClose} handleNewmcastAdded={this.handleMcastAdded.bind(this)}/>
		</div>
	}
};

export {McastPage, McastsPage};
