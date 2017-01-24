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
import SettingBaiduTTS from './system/baidu_tts';
import SettingEventSocket from './system/event_socket';

class SystemPage extends React.Component {
	constructor(props) {
		super(props);

		var w = localStorage.getItem("video-width");
		if (w == null) {
			w = 800;
			localStorage.setItem("video-width", w);
		}

		var h = localStorage.getItem("video-height");
		if (h == null) {
			h = 600;
			localStorage.setItem("video-height", h);
		}

		var r = localStorage.getItem("video-rate");
		if (r == null) {
			r = 10;
			localStorage.setItem("video-rate", r);
		}

		var wi = localStorage.getItem("audio-width");
		if (wi == null) {
			wi = 180;
			localStorage.setItem("audio-width", wi);
		}

		var he = localStorage.getItem("audio-height");
		if (he == null) {
			he = 240;
			localStorage.setItem("audio-height", he);
		}

		var ra = localStorage.getItem("audio-rate");
		if (ra == null) {
			ra = 10;
			localStorage.setItem("audio-rate", ra);
		}

		this.state = {editable: false, rows:[], video_rows:[
				{"id":"1",	"k":"video-width",	"v":w},
				{"id":"2",	"k":"video-height",	"v":h},
				{"id":"3",	"k":"video-rate",	"v":r}
				]
			, audio_rows:[
				{"id":"1",	"k":"audio-width",	"v":wi},
				{"id":"2",	"k":"audio-height",	"v":he},
				{"id":"3",	"k":"audio-rate",	"v":ra}],
		}
	}

	handleChange(obj) {
		const _this = this;
		const id = Object.keys(obj)[0];

		console.log("change", obj);
	}

	handleChangeVideo(obj) {
		const _this = this;
		const id = Object.keys(obj)[0];
		const value = Object.values(obj)[0];

		this.state.video_rows.map(function(row) {
			if (row.id == id) {
				localStorage.setItem(row.k, value);
			}
		});

		console.log("change", obj);
	}

	handleChangeAudio(obj) {
		const _this = this;
		const id = Object.keys(obj)[0];
		const value = Object.values(obj)[0];

		this.state.audio_rows.map(function(row) {
			if (row.id == id) {
				localStorage.setItem(row.k, value);
			}
		});

		console.log("change", obj);
	}

	componentDidMount() {

	}

	render() {
		const _this = this;

		const video_rows = this.state.video_rows.map((row) => {
			return <Row key={row.k}>
				<Col sm={2}><T.span text={row.k}/></Col>
				<Col>
					<RIEInput value={row.v} change={_this.handleChangeVideo.bind(_this)}
						propName={row.id}
						className={_this.state.highlight ? "editable" : "editable2"}
						validate={_this.isStringAcceptable}
						classLoading="loading"
						classInvalid="invalid"/>
				</Col>
			</Row>
		});

		const audio_rows = this.state.audio_rows.map((audio_row) => {
			return <Row key={audio_row.k}>
				<Col sm={2}><T.span text={audio_row.k}/></Col>
				<Col>
					<RIEInput value={audio_row.v} change={_this.handleChangeAudio.bind(_this)}
						propName={audio_row.id}
						className={_this.state.highlight ? "editable" : "editable2"}
						validate={_this.isStringAcceptable}
						classLoading="loading"
						classInvalid="invalid"/>
				</Col>
			</Row>
		});		

		return <div>
			<h1><T.span text="System Settings"/></h1>
			<hr/>
			<SettingBaiduTTS/>

			<hr/>
			<SettingEventSocket/>

			<hr/>
			<h2><T.span text="Log"/></h2>
			<ul>
				<li><a href="/api/freeswitch/log"><T.span text="Download Log"/></a></li>
			</ul>

			<h2><T.span text="Sound Files"/></h2>
			<ul>
				<li><a href="/api/freeswitch/dir/sounds" target="_blank"><T.span text="Sounds"/></a></li>
				<li><a href="/api/freeswitch/dir/storage" target="_blank"><T.span text="Storage"/></a></li>
			</ul>
		</div>
	}
}

export default SystemPage;
