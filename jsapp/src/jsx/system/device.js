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

class SettingDevice extends React.Component {
	constructor(props) {
		super(props);
		this.state = {editable: false, rows:[]};
		this.handleVideoSelChange = this.handleVideoSelChange.bind(this);
		this.handleResSelChange = this.handleResSelChange.bind(this);
		this.handleAuCheckChange = this.handleAuCheckChange.bind(this);
		this.handleGenCheckChange = this.handleGenCheckChange.bind(this);
		this.state = { camera: [], micro: [], speaker: [] };
	}

	componentWillMount() {
		this.state.framerate = (localStorage.getItem("framerate") != null) ? localStorage.getItem("framerate") : "default";
		this.state.resolution = (localStorage.getItem("resolution") != null) ? localStorage.getItem("resolution") : "default";
		this.state.AudioCheck = (localStorage.getItem("AudioCheck") != null) ? JSON.parse(localStorage.getItem("AudioCheck")) : { echo: false, noise: false, highpass: false };
		this.state.GenCheck = (localStorage.getItem("GenCheck") != null) ? JSON.parse(localStorage.getItem("GenCheck")) : { stereo: false, stun: false };
	}

	componentDidMount() {
		const _this = this;
		var runtime = function(obj) {
		 	console.log("runtime", obj);
		}
		$.verto.refreshDevices(runtime);
		 if ((!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) && MediaStreamTrack.getSources) {
            MediaStreamTrack.getSources(function (media_sources) {
                for (var i = 0; i < media_sources.length; i++) {
	                if (media_sources[i].kind == 'video') {
		                vid.push(media_sources[i]);
		                _this.state.camera.push( media_sources[i]);
	                 } else {
                        aud_in.push(media_sources[i]);
                    }
                }
                // console.info("Audio Devices", vid);
                // console.info("Video Devices", aud_in);
                runtime(true);
            });
        }  else {
            navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    devices.forEach(function(device) {
	                    // console.log(device);
	                    // console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
	                    switch(device.kind){
	                    	case "videoinput":
	                    	var bb = _this.state.micro;
	                    		bb.push(device);
	                    		_this.setState({camera:bb});
	                    		break;
	                    	case "audioinput":
	                    		var ss = _this.state.micro;
	                    		ss.push(device);
	                    		_this.setState({micro:ss});
	                    		break;
	                    	case "audiooutput":
	                    		var aa = _this.state.speaker;
	                    		aa.push(device);
	                    		_this.setState({ speaker: aa });
	                    		break;
	                    }
                    });
                runtime(false);
            })
        }
	}

	handleVideoSelChange(e){
		this.state.framerate = e.target.value;
		localStorage.setItem("framerate",e.target.value);
	}

	handleResSelChange(e){
		this.state.resolution = e.target.value;
		localStorage.setItem("resolution",e.target.value);
	}

	handleAuCheckChange(e){
		switch(e.target.value){
			case "1":
				this.state.AudioCheck.echo = e.target.checked;
				break;
			case "2":
				this.state.AudioCheck.noise = e.target.checked;
				break;
			case "3":
				this.state.AudioCheck.highpass = e.target.checked;
				break;
		}
		localStorage.setItem("AudioCheck",JSON.stringify(this.state.AudioCheck));
		console.log(this.state.AudioCheck);
	}

	handleGenCheckChange(e){
		if(e.target.value == 5){
			this.state.GenCheck.stereo = e.target.checked;
		}else{
			this.state.GenCheck.stun = e.target.checked;
		}
		localStorage.setItem("GenCheck",JSON.stringify(this.state.GenCheck));
	}

	render() {
		const _this = this;
        const video_rows = <Form horizontal id="newRouteForm">
                    <div className="row">
                        <Col sm={2}><T.span text="Camera" /></Col>
                        <Col sm={3}>
                        	<FormControl componentClass="select" id="camera" name="Camera" placeholder="select">
                        		{_this.state.camera.map(function(obj,index){
                        			return <option key={index}>{obj.label+"/"+obj.deviceId}</option>
                        		})}
                            </FormControl>
                        </Col>
                    </div>
                    <div className="row">
                        <Col sm={2}><T.span text="Best frame rate" /></Col>
                        <Col sm={3}>
                            <FormControl onChange={this.handleVideoSelChange} defaultValue={this.state.framerate} componentClass="select" name="Video-select" placeholder="select">
                                <option value="default" selected={this.state.a} ><T.span text="default" /></option>
                                <option value="10" label="10 FPS" selected={this.state.b}></option>
                                <option value="20" label="20 FPS" selected={this.state.c}></option>
                                <option value="30" label="30 FPS" selected={this.state.d}></option>
                            </FormControl>
                        </Col>
                    </div>
                    <div className="row">
                        <Col sm={2}><T.span text="Resolution" /></Col>
                        <Col sm={3}>
                            <FormControl onChange={this.handleResSelChange} defaultValue={this.state.resolution} componentClass="select" name="Resolution" placeholder="select">
                                <option value="default"><T.span text="default" /></option>
                                <option value="120P" label="160*120"></option>
                                <option value="240P" label="320*240"></option>
                                <option value="480P" label="640*480"></option>
                                <option value="720P" label="1280*720"></option>
                                <option value="1080P" label="1920*1080"></option>
                            </FormControl>
                        </Col>
                    </div>
                </Form>

        const audio_rows = <div>
            <div className="row">
                <Col sm={2}><T.span text="Microphone" /></Col>
                <Col sm={3}>
                    <FormControl componentClass="select" id="microphone" name="Microphone" placeholder="select">
                 		{_this.state.micro.map(function(obj,index){
                  			return <option key={index}>{obj.label+"/"+obj.deviceId}</option>
                        })}
                    </FormControl>
                </Col>
            </div>
            <div className="row">
                <Col sm={2}><T.span text="Speaker" /></Col>
                <Col sm={3}>
                    <FormControl componentClass="select" id="speaker" name="Speaker" placeholder="select">
                    	{_this.state.speaker.map(function(obj,index){
                  			return <option key={index}>{obj.label+"/"+obj.deviceId}</option>
                        })}
                    </FormControl>
                </Col>
            </div>
            <div className="row">
                <Col sm={4}>
                    <FormGroup id="audio_checkbox" onChange={this.handleAuCheckChange}>
                    	<Checkbox id="rateE1" name="checkthree" value="1" inline defaultChecked={_this.state.AudioCheck.echo}>
                    		<T.span text="Echo Cancellation" />
                    	</Checkbox>
                    	<br/><br/>
                    	<Checkbox id="rateF2" name="checkfour" value="2" inline defaultChecked={_this.state.AudioCheck.noise}>
                    		<T.span text="Noise Suppression" />
                    	</Checkbox>
                    	<br/><br/>
                    	<Checkbox id="rateJ3" name="checkzero" value="3" inline defaultChecked={_this.state.AudioCheck.highpass}>
                    		<T.span text="Highpass Filter" />
                    	</Checkbox>
                    </FormGroup>
                </Col>
            </div>
        </div>

		const general_rows = <div className="row">
								<Col sm={4}>
								<FormGroup onChange={this.handleGenCheckChange}>
									<Checkbox  name="checkfive" value="5"  inline defaultChecked={_this.state.GenCheck.stereo}>
										<T.span text="Stereo Audio" />
									</Checkbox>
									<br/><br/>
									<Checkbox  name="checksix" value="6" inline defaultChecked={_this.state.GenCheck.stun}>
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
