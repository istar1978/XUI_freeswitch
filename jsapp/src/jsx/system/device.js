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
import { Modal, ButtonGroup, ButtonToolbar, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Row, Col } from 'react-bootstrap';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
import verto from '../verto/verto';
import { Verto } from '../verto/verto';

export function getXUIDeviceSettings()
{
	var ds = {};

	var aec = localStorage.getItem("xui.audio.aec") || false;
	var agc = localStorage.getItem("xui.audio.agc") || false;
	var ns = localStorage.getItem("xui.audio.ns") || false;
	var highpass = localStorage.getItem("xui.audio.highpass") || false;
	var stereo = localStorage.getItem("xui.audio.stereo") || false;
	var stun = localStorage.getItem("xui.audio.stun") || false;
	var audioInDevice = localStorage.getItem("xui.audio.inDevice") || "any";
	var audioOutDevice = localStorage.getItem("xui.audio.outDevice") || "any";

	// localStorage is string only so convert them into boolean
	ds.aec = aec == "true";
	ds.agc = agc == "true";
	ds.ns = ns == "true";
	ds.highpass = highpass == "true";
	ds.stereo = stereo == "true";
	ds.stun = stun == "true";
	ds.audioInDevice = audioInDevice;
	ds.audioOutDevice = audioOutDevice;

	ds.resolution = localStorage.getItem("xui.video.resolution");
	ds.frameRate = localStorage.getItem("xui.video.frameRate") || 15;
	ds.videoDevice = localStorage.getItem("xui.video.videoDevice") || "any";

	return ds;
};

class SettingDevice extends React.Component {
	constructor(props) {
		super(props);
		this.handleVideoDeviceChange = this.handleVideoDeviceChange.bind(this);
		this.handleVideoFPSChange = this.handleVideoFPSChange.bind(this);
		this.handleResChange = this.handleResChange.bind(this);
		this.handleAuCheckChange = this.handleAuCheckChange.bind(this);
		this.state = { cameras: [], microphones: [], speakers: [],
			frameRate: 15, audioInDevice: "any", audioOutDevice: "any", videoDevice: "any",
			aec: false, agc: false, ns: false, highpass: false,
			stereo: false, stun: false
		};
	}

	componentWillMount() {
	}

	componentDidMount() {
		const _this = this;
		const ds = getXUIDeviceSettings();

		this.setState({
			aec: ds.aec,
			agc: ds.agc,
			ns: ds.ns,
			highpass: ds.highpass,
			audioInDevice: ds.audioInDevice,
			audioOutDevice: ds.audioOutDevice,
			stereo: ds.stereo,
			stun: ds.stun,
			videoDevice: ds.videoDevice,
			resolution: ds.resolution
		});

		var runtime = function(obj) {
			console.log("refreshDevices runtime", obj);
			_this.setState({
				cameras: Verto.videoDevices,
				microphones: Verto.audioInDevices,
				speakers: Verto.audioOutDevices,
				videoDevice: ds.videoDevice,
				frameRate: ds.frameRate
			});
		}

		Verto.refreshDevices(runtime);
	}

	handleVideoDeviceChange(e){
		this.state.videoDevice = e.target.value;
		localStorage.setItem("xui.video.videoDevice", e.target.value);
		this.setState({videoDevice: e.target.value});
	}

	handleVideoFPSChange(e){
		this.state.frameRate = e.target.value;
		localStorage.setItem("xui.video.frameRate", e.target.value);
		this.setState({frameRate: e.target.value});
	}

	handleResChange(e){
		this.state.resolution = e.target.value;
		localStorage.setItem("xui.video.resolution", e.target.value);
		this.setState({resolution: e.target.value});
	}

	handleAuCheckChange(e){
		switch(e.target.value){
			case "aec":
				this.setState({aec: e.target.checked});
				break;
			case "ns":
				this.setState({ns: e.target.checked});
				break;
			case "highpass":
				this.setState({highpass: e.target.checked});
				break;
			case "stereo":
				this.setState({stereo: e.target.checked});
				break;
			case "stun":
				this.setState({stun: e.target.checked});
				break;
		}

		localStorage.setItem("xui.audio." + e.target.value, e.target.checked);
	}

	handleAudioInDeviceChange(e) {
		localStorage.setItem("xui.audio.inDevice", e.target.value);
		this.setState({audioInDevice: e.target.value});
	}

	handleAudioOutDeviceChange(e) {
		localStorage.setItem("xui.audio.outDevice", e.target.value);
		this.setState({audioOutDevice: e.target.value});
	}


	render() {
		const _this = this;

		const video_rows = <Form horizontal id="newForm">
					<div className="row">
						<Col sm={2}><T.span text="Camera" /></Col>
						<Col sm={3}>
							<FormControl componentClass="select" onChange={this.handleVideoDeviceChange} value={this.state.videoDevice}>
								<option key='none' value='none'>{T.translate("No Camera")}</option>

								{_this.state.cameras.map(function(obj){
									return <option key={obj.id} value={obj.id}>{obj.label ? obj.label : obj.id}</option>
								})}
							</FormControl>
						</Col>
					</div>
					<div className="row">
						<Col sm={2}><T.span text="Best frame rate" /></Col>
						<Col sm={3}>
							<FormControl onChange={this.handleVideoFPSChange} value={this.state.frameRate} componentClass="select">
								<option value="default">{T.translate("default")}</option>
								<option value="10">10 FPS</option>
								<option value="15">15 FPS</option>
								<option value="24">24 FPS</option>
								<option value="25">25 FPS</option>
								<option value="30">30 FPS</option>
								<option value="60">60 FPS</option>
							</FormControl>
						</Col>
					</div>
					<div className="row">
						<Col sm={2}><T.span text="Resolution" /></Col>
						<Col sm={3}>
							<FormControl onChange={this.handleResChange} value={this.state.resolution} componentClass="select" name="Resolution">
								<option value="default">{T.translate("default")}</option>
								<option value="120p" label="120p 160x120 4:3"></option>
								<option value="QVGA" label="QVGA 320x240 4:3"></option>
								<option value="VGA"  label="VGA  640x480 4:3"></option>
								<option value="SVGA" label="SVGA 800x600 4:3"></option>
								<option value="180p" label="180p 320x180 16:9"></option>
								<option value="360p" label="360p 640x360 16:9"></option>
								<option value="720p" label="720p 1280x720 16:9"></option>
								<option value="1080p" label="1080p 1920x1080 16:9"></option>
								<option value="QCIF" label="QCIF 176x144 11:9"></option>
								<option value="CIF"  label="CIF  352x288 11:9"></option>
								<option value="4CIF" label="4CIF 704x576 11:9"></option>
							</FormControl>
						</Col>
					</div>
				</Form>

		const audio_rows = <div>
			<div className="row">
				<Col sm={2}><T.span text="Microphone" /></Col>
				<Col sm={3}>
					<FormControl componentClass="select" id="microphone" name="Microphone" onChange={_this.handleAudioInDeviceChange.bind(this)} value={_this.state.audioInDevice}>
						{_this.state.microphones.map(function(obj){
							return <option key={obj.id} value={obj.id}>{obj.label ? obj.label : obj.id}</option>
						})}
					</FormControl>
				</Col>
			</div>
			<div className="row">
				<Col sm={2}><T.span text="Speaker" /></Col>
				<Col sm={3}>
					<FormControl componentClass="select" id="speaker" name="Speaker" onChange={_this.handleAudioOutDeviceChange.bind(this)} value={_this.state.audioOutDevice}>
						{_this.state.speakers.map(function(obj){
							return <option key={obj.id} value={obj.id}>{obj.label ? obj.label : obj.id}</option>
						})}
					</FormControl>
				</Col>
			</div>
			<div className="row">
				<Col sm={4}>
					<FormGroup id="audio_checkbox" onChange={this.handleAuCheckChange}>
						<Checkbox id="rateE1" name="checkthree" value="aec" inline checked={_this.state.aec}>
							<T.span text="Echo Cancellation" />
						</Checkbox>
						<br/><br/>
						<Checkbox id="rateF2" name="checkfour" value="ns" inline checked={_this.state.ns}>
							<T.span text="Noise Suppression" />
						</Checkbox>
						<br/><br/>
						<Checkbox id="rateJ3" name="checkzero" value="highpass" inline checked={_this.state.highpass}>
							<T.span text="Highpass Filter" />
						</Checkbox>
					</FormGroup>
				</Col>
			</div>
		</div>

		const general_rows = <div className="row">
			<Col sm={4}>
			<FormGroup onChange={this.handleAuCheckChange}>
				<Checkbox value="stereo" inline checked={_this.state.stereo}>
					<T.span text="Stereo Audio" />
				</Checkbox>
				<br/><br/>
				<Checkbox value="stun" inline checked={_this.state.stun}>
					<T.span text="Use STUN" />
				</Checkbox>
			</FormGroup>
			</Col>
		</div>

		return <div>
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

export default SettingDevice;
