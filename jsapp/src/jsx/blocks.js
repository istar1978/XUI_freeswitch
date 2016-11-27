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

class BlockPage extends React.Component {
	constructor(props) {
		super(props);
		this.workspace = null;
	}

	componentDidMount() {
		console.log("did mount");

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
			var workspace = Blockly.inject('blocks', {
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
			<h1>Blocks</h1>
		</div>;
	}
}

export default BlockPage;
