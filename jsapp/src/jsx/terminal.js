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
 */

'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import T from 'i18n-react';

class Terminal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			commands: {},
			lines: [],
			prompt: '$ ',
			commandLine: '',
			history: ['status'],
			historyIndex: -1,
			lineNumber: 0
		}
	}

	clearScreen() {
		this.setState({ lines: [] });
	}

	registerCommands() {
		this.setState({
			commands: {
				'clear' : this.clearScreen.bind(this)
			}
		});
	}

	welcome() {
		this.pushLine("Welcome to FreeSWITCH ;)");
		const _this = this;
		fsAPI("status", "", function(ret) {
			_this.pushLine2(ret.message, 'pre');
		});
	}

	openLink(link) {
		return function() {
			window.open(link, '_blank');
		}
	}

	componentDidMount() {
		this.registerCommands();
		this.welcome();
		this.commandLine.focus();

		verto.subscribe("FSLog", {
			handler: this.handleFSLog.bind(this)
		});
	}

	componentWillUnmount() {
		verto.unsubscribe("FSLog");
	}

	componentDidUpdate() {
		// var el = ReactDom.findDOMNode(this);
		// var container = document.getElementsByClassName('container')[0];
		// var container = document.getElementById("terminal-area");
		// container.scrollTop = el.scrollHeight;
		// window.scrollTo(0, document.body.scrollHeight);
        this.commandLine.scrollIntoView(false);
	}

	handleArrows(e) {
		// console.log("keyDown", e.keyCode);
		var index = this.state.historyIndex;

		if (e.keyCode == 38) {// up
			index++;
		} else if (e.keyCode == 40) {// down
			index--;
		} else {
			return;
		}

		if (index < 0) {
			index = 0;
		} else if (index >= this.state.history.length) {
			index = this.state.history.length - 1;
		}

		this.state.historyIndex = index;
		this.setState({commandLine: this.state.history[index]}, function() {
			// put the cursor at the end of the line. todo: fix ?
			this.commandLine.selectionStart = this.commandLine.selectionEnd = this.state.history[index].length + 1;
		});
	}

	handleInput(e) {
		if (e.key === "Enter") {
			var input_text = this.state.commandLine;
			var input_array = input_text.split(' ');
			var input = input_array.shift();
			var arg = input_array.join(' ');
			var command = this.state.commands[input];

			this.pushLine(this.state.prompt + " " + input_text);
			this.state.history.unshift(input_text);
			this.state.historyIndex = -1;

			if (command === undefined) {
				const _this = this;

				fsAPI(input, arg, function(ret) {
					_this.pushLine2(ret.message, 'pre');
				});
			} else {
				command(arg);
			}

			this.setState({commandLine: ''});
		}
	}

	handleInputChange(e) {
		this.setState({commandLine: e.target.value});
	}

	pushLine(line) {
		this.state.lineNumber++;
		var lines = this.state.lines;
		lines.push(<p key={this.state.lineNumber}>{line}</p>)
		this.setState({'lines': lines});
	}

	pushLine2(line, type, level) {
		var lines = this.state.lines;
		this.state.lineNumber++;

		if (type == 'pre') {
			lines.push(<pre key={this.state.lineNumber}>{line}</pre>)
		} else if (type == 'span') {
			lines.push(<span key={this.state.lineNumber} className={"log" + level}>{line}<br/></span>)
		}

		this.setState({'lines': lines});
	}

	handleClick() {
		this.commandLine.focus();
	}

	handleFSLog(v, log) {
		// console.log("FSLog:", log.data);
		if (log.data == "\n") return;
		this.pushLine2(log.data, 'span', log.logLevel);
	}

	render() {
		// console.log("render", this.state.lines.length);
		return <div id='terminal-area' className='terminal-area' onClick={this.handleClick.bind(this)}>
			{this.state.lines}
			<p>
				<span className="prompt">{this.state.prompt}</span>
				<input type="text" ref={(input) => { this.commandLine = input; }}
					value={this.state.commandLine}
					onKeyPress={this.handleInput.bind(this)}
					onKeyDown={this.handleArrows.bind(this)}
					onChange={this.handleInputChange.bind(this)}
					className="terminal-input" />
			</p>
		</div>
	}
}

export default Terminal;
