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
import { Modal, ButtonGroup, ButtonToolbar, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Row, Col } from 'react-bootstrap';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';

class SettingEventSocket extends React.Component {
	constructor(props) {
		super(props);

		this.state = {editable: false, rows:[]}
	}

	handleChange(obj) {
		const _this = this;
		const id = Object.keys(obj)[0];
		const value = obj[id];

		console.log("id", id);
		console.log("value", value);

		$.ajax({
			type: "PUT",
			url: "/api/settings/event_socket/" + id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({v: value}),
			success: function (param) {
				console.log("success!!!!", param);

				const rows = _this.state.rows.map(function(row) {
					if (row.id == param.id) {
						row = param;
					}
					return row;
				});

				_this.setState({rows: rows});
			},
			error: function(msg) {
				console.error("update params", msg);
			}
		});
	}

	componentDidMount() {
		const _this = this;

		$.getJSON("/api/settings/event_socket", "", function(data) {
			_this.setState({rows: data});
		}, function(e) {
			console.log("get EventSocket ERR");
		});

		var runtime = function(obj) {
		 	console.log("runtime", obj);
			}

		$.verto.refreshDevices(runtime);

		if ((!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) && MediaStreamTrack.getSources) {
			MediaStreamTrack.getSources(function (media_sources) {
				for (var i = 0; i < media_sources.length; i++) {

				if (media_sources[i].kind == 'video') {
				 vid.push(media_sources[i]);
				 $("#camera").append('<option id= "' + media_sources[i].deviceId + '">' + media_sources[i].label + '</option>');
				 } else {
						aud_in.push(media_sources[i]);
					}
				}

				console.info("Audio Devices", vid);
				console.info("Video Devices", aud_in);
				runtime(true);
			});
		} else {
			navigator.mediaDevices.enumerateDevices()
				.then(function(devices) {
					devices.forEach(function(device) {
					console.log(device);

					console.log(device.kind + ": " + device.label + " id = " + device.deviceId);

						if (device.kind === "videoinput") {
							// vid.push({id: device.deviceId, kind: "video", label: device.label});
							$("#camera").append('<option id= "' + device.deviceId + '">' + device.label + '</option>');
						} else if (device.kind === "audioinput") {
							// aud_in.push({id: device.deviceId, kind: "audio_in", label: device.label});
							$("#microphone").append('<option id= "' + device.deviceId + '">' + device.label + '</option>');
						} else if (device.kind === "audiooutput") {
							// aud_out.push({id: device.deviceId, kind: "audio_out", label: device.label});
							$("#speaker").append('<option id= "' + device.deviceId + '">' + device.label + '</option>');
						}

					});

						runtime(false);
			})
		}

		var rateS=localStorage.getItem("S");
		var name = "#rateS"+rateS;
		$(name).attr("selected",true);

		$("#video-select").change(function(){
			var s = $(this).find("option:selected").val();
			localStorage.setItem("S", s);
		});


		var rateR=localStorage.getItem("R");
		var name = "#rateR"+rateR;
		$(name).attr("selected",true);

		$("#video-resolution").change(function(){
			var r = $(this).find("option:selected").val();
			localStorage.setItem("R", r);
		});

		var rateD=localStorage.getItem("D");
		var name = "#rateD"+rateD;
		$(name).attr("checked",true);

		$("#audio_checkbox").change(function(){
			var d = $("input[name='checktwo']:checked").val();
			localStorage.setItem("D", d);
		});

		var rateE=localStorage.getItem("E");
		var name = "#rateE"+rateE;
		$(name).attr("checked",true);

		$("#audio_checkbox").change(function(){
			var e = $("input[name='checkthree']:checked").val();
			localStorage.setItem("E", e);
		});

		var rateF=localStorage.getItem("F");
		var name = "#rateF"+rateF;
		$(name).attr("checked",true);

		$("#audio_checkbox").change(function(){
			var f = $("input[name='checkfour']:checked").val();
			localStorage.setItem("F", f);
		});

		var rateJ=localStorage.getItem("J");
		var name = "#rateJ"+rateJ;
		$(name).attr("checked",true);

		$("#audio_checkbox").change(function(){
			var j = $("input[name='checkzero']:checked").val();
			localStorage.setItem("J", j);
		});

		var rateG=localStorage.getItem("G");
		var name = "#rateG"+rateG;
		$(name).attr("checked",true);

		$("#general_checkbox").change(function(){
			var g = $("input[name='checkfive']:checked").val();
			localStorage.setItem("G", g);
		});

		var rateH=localStorage.getItem("H");
		var name = "#rateH"+rateH;
		$(name).attr("checked",true);

		$("#general_checkbox").change(function(){
			var h = $("input[name='checksix']:checked").val();
			localStorage.setItem("H", h);
		});

	}

	handleToggleParam(e) {
		const _this = this;
		const param_id = e.target.getAttribute("data");

		$.ajax({
			type: "PUT",
			url: "/api/settings/event_socket/" + param_id,
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({action: "toggle"}),
			success: function (param) {
				console.log("success!!!!", param);

				const rows = _this.state.rows.map(function(row) {
					if (row.id == param.id) {
						row.disabled = param.disabled;
					}
					return row;
				});

				_this.setState({rows: rows});
			},
			error: function(msg) {
				console.error("toggle params", msg);
			}
		});
	}

	handleReload() {
		fsAPI("reload", "mod_event_socket", function(r) {
			notify(<T.span text="Module reloaded"/>);
		});
	}

	render() {
		const _this = this;


		const rows = this.state.rows.map((row) => {
			const enabled_style = dbfalse(row.disabled) ? "success" : "default";
			const disabled_class = dbfalse(row.disabled) ? null : "disabled";
			return <Row key={row.id} className={disabled_class}>
				<Col sm={2} title={T.translate("eventsocket-"+row.k)}>{row.k}</Col>
				<Col sm={8}>
					<RIEInput value={row.v} change={_this.handleChange.bind(_this)}
						propName={row.id}
						className={_this.state.highlight ? "editable" : "editable2"}
						validate={_this.isStringAcceptable}
						classLoading="loading"
						classInvalid="invalid"/>
				</Col>
				<Col sm={2}>
					<Button onClick={_this.handleToggleParam.bind(this)} data={row.id} bsStyle={enabled_style}>
						{dbfalse(row.disabled) ? T.translate("Enabled") : T.translate("Disabled")}
					</Button>
				</Col>
			</Row>
		});

		const video_rows = <Form horizontal id="newRouteForm">
					<div className="row">
						<Col sm={2}><T.span text="Camera" /></Col>
						<Col sm={3}>
							<FormControl componentClass="select" id="camera" name="Camera" placeholder="select">
							</FormControl>
						</Col>
					</div>

					<div className="row">
						<Col sm={2}><T.span text="Best frame rate" /></Col>
						<Col sm={3}>
							<FormControl componentClass="select" id="video-select" name="Video-select" placeholder="select">
								<option value="default"><T.span text="default" /></option>
								<option id="rateS10" value="10" label="10 FPS"></option>
								<option id="rateS20" value="20" label="20 FPS"></option>
								<option id="rateS30" value="30" label="30 FPS"></option>
							</FormControl>
						</Col>
					</div>

					<div className="row">
						<Col sm={2}><T.span text="Resolution" /></Col>
						<Col sm={3}>
							<FormControl componentClass="select" id="video-resolution" name="Resolution" placeholder="select">
								<option value="default"><T.span text="default" /></option>
								<option id="rateR120P" value="120P" label="160*120"></option>
								<option id="rateR240P" value="240P" label="320*240"></option>
								<option id="rateR480P" value="480P" label="640*480"></option>
								<option id="rateR720P" value="720P" label="1280*720"></option>
								<option id="rateR1080P" value="1080P" label="1920*1080"></option>
							</FormControl>
						</Col>
					</div>
				</Form>

		const audio_rows = <div>
					<div className="row">
						<Col sm={2}><T.span text="Microphone" /></Col>
						<Col sm={3}>
							<FormControl componentClass="select" id="microphone" name="Microphone" placeholder="select">
							</FormControl>
						</Col>
					</div>

					<div className="row">
						<Col sm={2}><T.span text="Speaker" /></Col>
						<Col sm={3}>
							<FormControl componentClass="select" id="speaker" name="Speaker" placeholder="select">
							</FormControl>
						</Col>
					</div>
					<div className="row">
						<Col sm={4}>
							<FormGroup id="audio_checkbox">
						    	<Checkbox id="rateE1" name="checkthree" value="1" inline>
						    		<T.span text="Echo Cancellation" />
						    	</Checkbox>
						    	<br/><br/>
						    	<Checkbox id="rateF2" name="checkfour" value="2" inline>
						    		<T.span text="Noise Suppression" />
						    	</Checkbox>
						    	<br/><br/>
						    	<Checkbox id="rateJ3" name="checkzero" value="3" inline>
						    		<T.span text="Highpass Filter" />
						    	</Checkbox>
						    </FormGroup>
						</Col>
					</div>
				</div>

		const general_rows = <div className="row">
					<Col sm={4}>
						<FormGroup id="general_checkbox">
					    	<Checkbox id="rateG5" name="checkfive" value="5" inline>
					    		<T.span text="Stereo Audio" />
					    	</Checkbox>
					    <br/><br/>
					    	<Checkbox id="rateH6" name="checksix" value="6" inline>
					    		<T.span text="Use STUN" />
					    	</Checkbox>
					    </FormGroup>
					</Col>
				</div>


		return <div>
			<ButtonToolbar className="pull-right">
			<ButtonGroup>
				<Button><T.span onClick={this.handleReload} text="Reload"/></Button>
			</ButtonGroup>
			</ButtonToolbar>

			<h2><T.span text="EventSocket Settings"/></h2>
			{rows}
			<hr/>
			<h2><T.span text="Video Settings" /></h2>
			{video_rows}
			<hr/>
			<h2><T.span text="Audio Settings" /></h2>
			{audio_rows}
			<hr/>
			<h2><T.span text="General Settings"/></h2>
			{general_rows}
		</div>;
	}
}

export default SettingEventSocket;
