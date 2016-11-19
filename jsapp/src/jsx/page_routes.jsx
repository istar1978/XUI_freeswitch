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

	var RoutesPage = React.createClass({
		getInitialState: function() {
			return {rows: [], smShow: false, lgShow: false};
		},

		handleControlClick: function(e) {
			var data = e.target.getAttribute("data");
			console.log("data", data);
		},

		handleClick: function(x) {
		},

		componentWillMount: function() {
		},

		componentWillUnmount: function() {
		},

		componentDidMount: function() {
			var _this = this;
			fsAPI("list_users", "", function(data) {
				// console.log(data.message);
				var lines = data.message.split("\n");
				var rows = [];

				for (var i = 0; i < lines.length; i++) {
					if (i == 0 || i >= lines.length - 2) continue;

					cols = lines[i].split("|");
					row = {};

					row.index = i;
					row.userid    = cols[0];
					row.context   = cols[1];
					row.domain    = cols[2];
					row.group     = cols[3];
					row.contact   = cols[4];
					row.callgroup = cols[5];
					row.cidname   = cols[6];
					row.cidnumber = cols[7];
					rows.push(row);
				}

				_this.setState({rows: rows});
			}, function(e) {
				console.log("list_users ERR");
			});
		},

		handleFSEvent: function(v, e) {
		},

		render: function() {
			let smClose = () => this.setState({ smShow: false });
		    let lgClose = () => this.setState({ lgShow: false });

			var rows = [];
			this.state.rows.forEach(function(row) {
				rows.push(<tr key={row.index}>
						<td>{row.userid}</td>
						<td>{row.context}</td>
						<td>{row.domain}</td>
						<td>{row.group}</td>
						<td>{row.constact}</td>
						<td>{row.callgroup}</td>
						<td>{row.cidname}</td>
						<td>{row.cidnumber}</td>
				</tr>);
			})

			return <div>
				<div className="controls">
					<button onClick={this.handleControlClick} data="new">New</button>
				</div>

				<h1>Routes</h1>

				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>ID</th>
						<th>Context</th>
						<th>Prefix</th>
						<th>Type</th>
						<th>Dest</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});
