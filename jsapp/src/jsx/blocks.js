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
import { Modal, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Col } from 'react-bootstrap';
import { Link } from 'react-router';

class BlockPage extends React.Component {
	constructor(props) {
		super(props);
		this.workspace = null;
		this.state = {block: {name: "Loading ..."}};
	}

	componentDidMount() {
		console.log("did mount", this.props);
		var _this = this;

		var onresize = function() {
			var div = $('#main');

			if (div && div.offset()) {
				div.height(window.innerHeight - div.offset().top);
				div.width(window.innerWidth - 100);
			}
		};

		var load_toolbox = function() {

var toolbox = `<xml id='toolbox' style='display:none'/>
<category name="IVR">
	<block type="fsStart"></block>
	<block type="IVR"></block>
	<block type="IVREntry"></block>
</category>

<category name="FreeSWITCH">
	<block type="fsConsoleLog"></block>
	<block type="fsSetTTS"></block>
	<block type="fsFilePath"></block>
	<block type="fsSessionAnswer"></block>
	<block type="fsSessionGet"></block>
	<block type="fsSessionSet"></block>
	<block type="fsSessionPlay"></block>
	<block type="fsSessionSpeak"></block>
	<block type="fsSessionRead"></block>
	<block type="fsSessionExecute"></block>
</category>

<category name="FSDB">
	<block type="fsDBH"></block>
	<block type="fsDBHQuery"></block>
	<block type="fsDBHRow"></block>
</category>

<sep></sep>

<category name="Logic">
	<category name="If">
		<block type="controls_if"></block>
		<block type="controls_if">
		<mutation else="1"></mutation>
	</block>
	<block type="controls_if">
		<mutation elseif="1" else="1"></mutation>
	</block>
	</category>

	<category name="Boolean">
		<block type="logic_compare"></block>
		<block type="logic_operation"></block>
		<block type="logic_negate"></block>
		<block type="logic_boolean"></block>
		<block type="logic_null"></block>
		<block type="logic_ternary"></block>
	</category>
</category>

<category name="Loops">
	<block type="controls_repeat_ext">
		<value name="TIMES">
			<block type="math_number">
				<field name="NUM">10</field>
			</block>
		</value>
	</block>
	<block type="controls_whileUntil"></block>
	<block type="controls_for">
		<field name="VAR">i</field>
			<value name="FROM">
				<block type="math_number">
					<field name="NUM">1</field>
				</block>
			</value>
			<value name="TO">
				<block type="math_number">
					<field name="NUM">10</field>
				</block>
			</value>
			<value name="BY">
			<block type="math_number">
				<field name="NUM">1</field>
			</block>
		</value>
	</block>
	<block type="controls_forEach"></block>
	<block type="controls_flow_statements"></block>
</category>

<category name="Math">
	<block type="math_number"></block>
	<block type="math_arithmetic"></block>
	<block type="math_single"></block>
	<block type="math_trig"></block>
	<block type="math_constant"></block>
	<block type="math_number_property"></block>
	<block type="math_change">
		<value name="DELTA">
			<block type="math_number">
				<field name="NUM">1</field>
			</block>
		</value>
	</block>
	<block type="math_round"></block>
	<block type="math_on_list"></block>
	<block type="math_modulo"></block>
	<block type="math_constrain">
		<value name="LOW">
			<block type="math_number">
				<field name="NUM">1</field>
			</block>
		</value>
		<value name="HIGH">
			<block type="math_number">
				<field name="NUM">100</field>
			</block>
		</value>
	</block>
	<block type="math_random_int">
		<value name="FROM">
			<block type="math_number">
				<field name="NUM">1</field>
			</block>
		</value>
		<value name="TO">
			<block type="math_number">
				<field name="NUM">100</field>
			</block>
		</value>
	</block>
	<block type="math_random_float"></block>
</category>

<category name="Lists">
		<block type="lists_create_empty"></block>
		<block type="lists_create_with"></block>
		<block type="lists_repeat">
			<value name="NUM">
				<block type="math_number">
					<field name="NUM">5</field>
				</block>
			</value>
		</block>
		<block type="lists_length"></block>
		<block type="lists_isEmpty"></block>
		<block type="lists_indexOf"></block>
		<block type="lists_getIndex"></block>
		<block type="lists_setIndex"></block>
</category>

<category name="Variables" custom="VARIABLE"></category>

<category name="Functions" custom="PROCEDURE"></category>

<category name="Text">
	<block type="text"></block>
	<block type="text_join"></block>
	<block type="text_create_join_container"></block>
	<block type="text_create_join_item"></block>
	<block type="text_append"></block>
	<block type="text_length"></block>
	<block type="text_isEmpty"></block>
	<block type="text_indexOf"></block>
	<block type="text_charAt"></block>
	<block type="text_getSubstring"></block>
	<block type="text_changeCase"></block>
	<block type="text_trim"></block>
	<block type="text_print"></block>
	<block type="text_prompt_ext"></block>
	<block type="text_prompt"></block>
</category>
</xml>`

			var xml = document.createElement('div');
			xml.innerHTML = toolbox;

			var body = document.getElementById('body');
			body.appendChild(xml);
		}

		var init_blockly = function() {
			let workspace = Blockly.inject('blocks', {
				toolbox: document.getElementById('toolbox'),
				media: "/assets/blockly/media/"
			});
			return workspace;
		}

		if (typeof(Blockly) === "undefined") {
			// this dosn't work yet, trying to figure out, if you know how to make it work, fire a pull request
			window.alert("SHOULD NOT HAPPEN!");

			var body = document.getElementById('body');
			var script = document.createElement('script');

			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', "/assets/blockly/blockly_compressed.js");
			body.appendChild(script);
			script.setAttribute('src', "/assets/blockly/blocks_compressed.js");
			body.appendChild(script);
			script.setAttribute('src', "/assets/blockly/lua_compressed.js");
			body.appendChild(script);
			script.setAttribute('src', "/assets/blockly/javascript_compressed.js");
			body.appendChild(script);
			script.setAttribute('src', "/assets/blockly/fs_blocks.js");
			body.appendChild(script);
			script.setAttribute('src', "/assets/blockly/fs_blocks_lua.js");
			body.appendChild(script);
			script.setAttribute('src', "/assets/blockly/fs_blocks_javascript.js");
			body.appendChild(script);
			script.setAttribute('src', "/assets/blockly/en.js");
			body.appendChild(script);

			setTimeout(init_blockly, 1000);
			window.addEventListener('resize', onresize, false);
			onresize();
		} else {
			load_toolbox();
			this.workspace = init_blockly();
			onresize();
			window.addEventListener('resize', onresize, false);
		}

		$.getJSON("/api/blocks/" + this.props.params.id, function(block) {
			_this.setState({block, block});

			if (block && block.xml && block.xml.length > 0) {
				Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(block.xml), _this.workspace);
			}
		});
	}

	handleControlClick(e) {
		let _this = this;
		let data = e.target.getAttribute("data");

		let toLua = function() {
			let code = Blockly.Lua.workspaceToCode(_this.workspace);
			console.log(code);
			return code;
		}

		if (data == "save") {
			let lua = toLua();
			let block = {}
			block.id = this.props.params.id;
			block.lua = toLua();
			let xml = Blockly.Xml.workspaceToDom(_this.workspace);
			block.xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(_this.workspace));
			block.js = "alert(1);"// disabled;

			$.ajax({
				type: "POST",
				url: "/api/blocks/" + block.id,
				headers: {"X-HTTP-Method-Override": "PUT"},
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(block),
				success: function () {
					_this.setState({errmsg: {key: "Saved at", time: Date()}});
				},
				error: function(msg) {
					console.error("block", msg);
				}
			});
		} else if (data == "export") {
			let download = function(filename, text) {
				var pom = document.createElement('a');
				pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
				pom.setAttribute('download', filename);

				if (document.createEvent) {
					var event = document.createEvent('MouseEvents');
					event.initEvent('click', true, true);
					pom.dispatchEvent(event);
				} else {
					pom.click();
				}
			}

		    download("test.lua", toLua());

		}
	}

	componentWillUnmount() {
		console.log("will unmount ......");
		if (this.workspace) {
			this.workspace.dispose();
			this.workspace = null;
		}
	}

	render() {
		return <div id='blocks'>
			<div className="controls">
				<Button><T.span onClick={this.handleControlClick.bind(this)} data="export" text="Export" /></Button>
				<Button><T.span onClick={this.handleControlClick.bind(this)} data="save" text="Save" /></Button>
			</div>
			<h1><T.span text="Blocks"/> {this.state.block.name} <small>{this.state.block.description}</small></h1>
		</div>;
	}
}

class NewBlock extends React.Component {
	propTypes: {handleNewUserAdded: React.PropTypes.func}

	constructor(props) {
		super(props);

		this.last_id = 0;
		this.state = {errmsg: ''};

		// This binding is necessary to make `this` work in the callback
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		let _this = this;

		console.log("submit...");
		let block = form2json('#newBlockForm');
		console.log("block", block);

		if (!block.name) {
			this.setState({errmsg: "Mandatory fields left blank"});
			return;
		}

		$.ajax({
			type: "POST",
			url: "/api/blocks",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(block),
			success: function () {
				_this.last_id++;
				block.id = "NEW" + _this.last_id;
				_this.props["data-handleNewBlockAdded"](block);
			},
			error: function(msg) {
				console.error("route", msg);
			}
		});
	}

	render() {
		console.log(this.props);

		return <Modal {...this.props} aria-labelledby="contained-modal-title-lg">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-lg"><T.span text="Create New Block" /></Modal.Title>
			</Modal.Header>
			<Modal.Body>
			<Form horizontal id="newBlockForm">
				<FormGroup controlId="formName">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Name" className="mandatory"/></Col>
					<Col sm={10}><FormControl type="input" name="name" placeholder="cool_block" /></Col>
				</FormGroup>

				<FormGroup controlId="formDescriptioin">
					<Col componentClass={ControlLabel} sm={2}><T.span text="Description"/></Col>
					<Col sm={10}><FormControl type="description" name="description" placeholder="IVR block for ..." /></Col>
				</FormGroup>

				<FormGroup>
					<Col smOffset={2} sm={10}>
						<Button type="button" bsStyle="primary" onClick={this.handleSubmit}>
							<i className="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;<T.span text="Save" />
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

class BlocksPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {rows: [], formShow: false};

		// this.handleSubmit = this.handleSubmit.bind(this);
		this.handleControlClick = this.handleControlClick.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleControlClick(e) {
		this.setState({ formShow: true});
	}

	handleBlockAdded(block) {
		var rows = this.state.rows;
		rows.push(block);
		this.setState({rows: rows, formShow: false});
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
			url: "/api/blocks/" + id,
			success: function () {
				console.log("deleted")
				var rows = _this.state.rows.filter(function(row) {
					return row.id != id;
				});

				_this.setState({rows: rows});
			},
			error: function(msg) {
				console.error("block", msg);
			}
		});
	}

	componentDidMount() {
		var _this = this;
		$.getJSON("/api/blocks", function(blocks) {
			console.log("blocks", blocks);
			_this.setState({rows: blocks});
		});
	}

	render() {
		let formClose = () => this.setState({ formShow: false });
		let toggleDanger = () => this.setState({ danger: !this.state.danger });
	    var danger = this.state.danger ? "danger" : "";

		let _this = this;

		let rows = this.state.rows.map(function(row) {
			return <tr key={row.id}>
					<td>{row.id}</td>
					<td><Link to={`/blocks/${row.id}`}>{row.name}</Link></td>
					<td>{row.description}</td>
					<td>{row.created_at}</td>
					<td><T.a onClick={_this.handleDelete} data-id={row.id} text="Delete" className={danger}/></td>
			</tr>;
		})

		return <div>
			<div className="controls">
				<Button>
					<i className="fa fa-plus" aria-hidden="true"></i>&nbsp;
					<T.span onClick={this.handleControlClick} data="new" text="New" />
				</Button>
			</div>

			<h1><T.span text="IVR Blocks"/></h1>
			<div>
				<table className="table">
				<tbody>
				<tr>
					<th><T.span text="ID"/></th>
					<th><T.span text="Name"/></th>
					<th><T.span text="Description"/></th>
					<th><T.span text="Created At"/></th>
					<th><T.span text="Delete" className={danger} onClick={toggleDanger} title={T.translate("Click me to toggle fast delete mode")}/></th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>

			<NewBlock show={this.state.formShow} onHide={formClose} data-handleNewBlockAdded={this.handleBlockAdded.bind(this)}/>
		</div>
	}
}

export {BlocksPage, BlockPage};
