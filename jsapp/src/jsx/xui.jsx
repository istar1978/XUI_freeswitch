// $(document).ready(function(){

	function translateMember(member) {
		m = {
			'uuid': member[0],
			'memberID': member[1][0],
			'cidNumber': member[1][1],
			'cidName': member[1][2],
			'codec': member[1][3],
			'status': JSON.parse(member[1][4]),
			'email': member[1][5].email,
			'active': false
		};

		// console.log("m", m);
		return m;
	}

	var NavItem = React.createClass({
		getInitialState: function() {
			return this.props.item;
		},

		handleClick: function(e) {
			// console.log("target", e.target);
			this.props.resetALL(e.currentTarget.getAttribute("data-item-id"));

			if (this.props.item.id == "M_OVERVIEW") {
				ReactDOM.render(<OverViewPage auto_update={true}/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_CALLS") {
				ReactDOM.render(<CallsPage/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_CHANNELS") {
				ReactDOM.render(<ChannelsPage/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_USERS") {
				ReactDOM.render(<UsersPage/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_SOFIA") {
				ReactDOM.render(<SofiaPage/>, document.getElementById("main"));
			} else if (this.props.item.id.substring(0, 7) == "M_SHOW_") {
				var what = this.props.item.id.substr(7);
				ReactDOM.render(<div></div>, document.getElementById("main"));
				ReactDOM.render(<ShowFSPage what={what} title={this.props.item.description}/>, document.getElementById("main"));
			} else if (this.props.item.id.substring(0, 7) == "M_CONF_") {
				ReactDOM.render(<div></div>, document.getElementById("main"));
				ReactDOM.render(<ConferencePage name={this.props.item.data} title={this.props.item.description}/>, document.getElementById("main"));
			} else {
				ReactDOM.render(<span>{this.props.item.description}</span>, document.getElementById('main'));
			}
		},

		render: function() {
			var className = this.props.active ? "active" : "";
			return <li className={className}><a href="#" data-item-id={this.props.item.id} onClick={this.handleClick}>{this.props.item.description}</a></li>;
		}
	});

	var NavBar = React.createClass({
		getInitialState: function() {
			return {
				items: this.props.items,
				activeItem: this.props.items[0].id
			};
		},

		resetALL: function(item_id) {
			this.setState({activeItem: item_id});
		},

		render: function() {
			var _this = this;
			items = [];

			this.state.items.forEach(function(item) {
				console.log("handleClick", this.handleClick);
				items.push(<NavItem item={item} key={item.id} active={item.id == _this.state.activeItem} resetALL={_this.resetALL}/>);
			});

			return (
				<ul className="nav nav-sidebar" id="nav-sidebar">
					{items}
				</ul>
			);
		}

	});

	var AboutPage = React.createClass({

		render: function() {
			return <div>
				<h1>About XUI</h1>
				<p>XUI is a FreeSWITCH UI framework and implementation.</p>
				<p>Author: Seven Du</p>
				<p>See <a href="https://github.com/seven1240/xui" target="_blank">XUI Github page</a> for more info.</p>
			</div>;
		}
	});

	var OverViewPage = React.createClass({
		// overview is so special because it must wait the websocket connected before it can get any data
		getInitialState: function() {
			return {msg: "connecting ..."};
		},

		handleClick: function(x) {
		},

		componentWillMount: function() {
			// listen to "update-status" event
			window.addEventListener("update-status", this.handleUpdateStatus);
		},

		componentWillUnmount: function() {
			window.removeEventListener("update-status", this.handleUpdateStatus);
		},

		componentDidMount: function() {
			if (this.props.auto_update) {
				var _this = this;
				fsStatus(function(e) {
					_this.setState({msg: e.message});
				})
			}
		},

		handleUpdateStatus: function(e) {
			// console.log("eeee", e.detail);
			this.setState({msg: e.detail.message});
		},

		render: function() {
			return <div><pre>{this.state.msg}</pre></div>;
		}
	});

	var CallsPage = React.createClass({
		getInitialState: function() {
			return {rows: []};
		},

		handleClick: function(x) {
		},

		componentWillMount: function() {
		},

		componentWillUnmount: function() {
			verto.unsubscribe("FSevent.channel_create");
			verto.unsubscribe("FSevent.channel_progress");
			verto.unsubscribe("FSevent.channel_answer");
			verto.unsubscribe("FSevent.channel_bridge");
			verto.unsubscribe("FSevent.channel_hangup");
			// verto.unsubscribe("FSevent");
		},

		componentDidMount: function() {
			var _this = this;
			showFSAPI("calls", function(data) {
				var msg = $.parseJSON(data.message);
				if (msg.row_count === 0) {
					_this.setState({rows: []});
				} else {
					console.log(msg.rows);
					_this.setState({rows: msg.rows});
				};
			});

			verto.subscribe("FSevent.channel_create", {
				handler: this.handleFSEvent
			});

			verto.subscribe("FSevent.channel_progress", {
				handler: this.handleFSEvent
			});

			verto.subscribe("FSevent.channel_answer", {
				handler: this.handleFSEvent
			});

			verto.subscribe("FSevent.channel_bridge", {
				handler: this.handleFSEvent
			});

			verto.subscribe("FSevent.channel_hangup", {
				handler: this.handleFSEvent
			});

			// verto.subscribe("FSevent", {
			// 	handler: _this.handleFSEvent
			// });
		},

		handleFSEvent: function(v, e) {
			console.log("FSevent:", e);
			if (e.eventChannel == "FSevent.channel_create") {
				var rows = this.state.rows;
				var row = {};
				var date = new Date(parseInt(e.data["Caller-Channel-Created-Time"]) / 1000).toISOString();

				row.uuid = e.data["Unique-ID"];
				row.cid_num = e.data["Caller-Caller-ID-Number"];
				row.dest = e.data["Caller-Destination-Number"];
				row.callstate = e.data["Channel-Call-State"];
				row.direction = e.data["Call-Direction"];
				row.created = date;
				rows.push(row);
				this.setState({rows: rows});
			} else if (e.eventChannel == "FSevent.channel_progress") {
				var rows = [];
				var uuid = e.data["Unique-ID"];

				this.state.rows.forEach(function(row) {
					if (uuid == row.uuid) {
						row.callstate = e.data["Channel-Call-State"];
					}
					rows.push(row);
				});

				this.setState({rows: rows});

			} else if (e.eventChannel == "FSevent.channel_answer") {
				var rows = [];
				var uuid = e.data["Unique-ID"];

				this.state.rows.forEach(function(row) {
					if (uuid == row.uuid) {
						row.callstate = "Active";
					}
					rows.push(row);
				});

				this.setState({rows: rows});
			} else if (e.eventChannel == "FSevent.channel_hangup") {
				var rows = [];
				var uuid = e.data["Unique-ID"];

				// delete from rows, maybe find a more efficient way?
				this.state.rows.forEach(function(row) {
					if (uuid != row.uuid) {
						rows.push(row);
					}
				});

				this.setState({rows: rows});
			} else if (e.eventChannel == "FSevent.channel_bridge") {
				var rows = [];
				var uuid = e.data["Unique-ID"];
				console.log("eeeeeeee", e);
				this.state.rows.forEach(function(row) {
					if (row.uuid == uuid) {
						var date = new Date(parseInt(e.data["Other-Leg-Channel-Created-Time"]) / 1000).toISOString();

						row.callstate = e.data["Channel-Call-State"];
						row.b_uuid = e.data["Other-Leg-Unique-ID"];
						row.b_callstate = e.data["Other-Leg-Callstate"];
						row.b_direction = e.data["Other-Leg-Direction"];
						row.b_created = date;
						rows.push(row);
					} else if (row.uuid == e.data["Other-Leg-Unique-ID"]) {
						// remove this channel
					} else {
						rows.push(row);
					}
				});

				this.setState({rows: rows});
			}
		},

		render: function() {
			var rows = [];
			this.state.rows.forEach(function(row) {
				rows.push(<tr key={row.uuid}>
						<td>{row.uuid}<br/>{row.b_uuid}</td>
						<td>{row.cid_num}</td>
						<td>{row.dest}</td>
						<td>{row.callstate}<br/>{row.b_callstate}</td>
						<td>{row.direction}<br/>{row.b_direction}</td>
						<td>{row.created}<br/>{row.b_created}</td>
				</tr>);
			})

			return <div>
				<h1>Calls</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>UUID</th>
						<th>CID</th>
						<th>Dest</th>
						<th>Call State</th>
						<th>Direction</th>
						<th>Created</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var ChannelsPage = React.createClass({
		getInitialState: function() {
			return {rows: []};
		},

		handleClick: function(x) {
		},

		componentWillMount: function() {
		},

		componentWillUnmount: function() {
			verto.unsubscribe("FSevent.channel_create");
			verto.unsubscribe("FSevent.channel_progress");
			verto.unsubscribe("FSevent.channel_answer");
			verto.unsubscribe("FSevent.channel_hangup");
			// verto.unsubscribe("FSevent");
		},

		componentDidMount: function() {
			var _this = this;
			showFSAPI("channels", function(data) {
				var msg = $.parseJSON(data.message);
				if (msg.row_count === 0) {
					_this.setState({rows: []});
				} else {
					console.log(msg.rows);
					_this.setState({rows: msg.rows});
				};
			});

			verto.subscribe("FSevent.channel_create", {
				handler: this.handleFSEvent
			});

			verto.subscribe("FSevent.channel_progress", {
				handler: this.handleFSEvent
			});

			verto.subscribe("FSevent.channel_answer", {
				handler: this.handleFSEvent
			});

			verto.subscribe("FSevent.channel_hangup", {
				handler: this.handleFSEvent
			});

			// verto.subscribe("FSevent", {
			// 	handler: _this.handleFSEvent
			// });
		},

		handleFSEvent: function(v, e) {
			console.log("FSevent:", e);
			if (e.eventChannel == "FSevent.channel_create") {
				var rows = this.state.rows;
				var row = {};
				var date = new Date(parseInt(e.data["Caller-Channel-Created-Time"]) / 1000).toISOString();

				row.uuid = e.data["Unique-ID"];
				row.cid_num = e.data["Caller-Caller-ID-Number"];
				row.dest = e.data["Caller-Destination-Number"];
				row.callstate = e.data["Channel-Call-State"];
				row.direction = e.data["Call-Direction"];
				row.created = date;
				rows.push(row);
				this.setState({rows: rows});
			} else if (e.eventChannel == "FSevent.channel_progress") {
				var rows = [];
				var uuid = e.data["Unique-ID"];

				this.state.rows.forEach(function(row) {
					if (uuid == row.uuid) {
						row.callstate = e.data["Channel-Call-State"];
					}
					rows.push(row);
				});

				this.setState({rows: rows});

			} else if (e.eventChannel == "FSevent.channel_answer") {
				var rows = [];
				var uuid = e.data["Unique-ID"];

				this.state.rows.forEach(function(row) {
					if (uuid == row.uuid) {
						row.callstate = "Active";
					}
					rows.push(row);
				});

				this.setState({rows: rows});
			} else if (e.eventChannel == "FSevent.channel_hangup") {
				var rows = [];
				var uuid = e.data["Unique-ID"];

				// delete from rows, maybe find a more efficient way?
				this.state.rows.forEach(function(row) {
					if (uuid != row.uuid) {
						rows.push(row);
					}
				});

				this.setState({rows: rows});
			}
		},

		render: function() {
			var rows = [];
			this.state.rows.forEach(function(row) {
				rows.push(<tr key={row.uuid}>
						<td>{row.uuid}</td>
						<td>{row.cid_num}</td>
						<td>{row.dest}</td>
						<td>{row.callstate}</td>
						<td>{row.direction}</td>
						<td>{row.created}</td>
				</tr>);
			})

			return <div>
				<h1>Channels</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>UUID</th>
						<th>CID</th>
						<th>Dest</th>
						<th>Call State</th>
						<th>Direction</th>
						<th>Created</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var UsersPage = React.createClass({
		getInitialState: function() {
			return {rows: []};
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
				<h1>Users</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>ID</th>
						<th>Context</th>
						<th>Domain</th>
						<th>Group</th>
						<th>Contact</th>
						<th>Callgroup</th>
						<th>CidName</th>
						<th>CidNumber</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});


	var Member = React.createClass({
		propTypes: {
			onMemberClick: React.PropTypes.func,
		},

		getInitialState: function() {
			return this.props.member;
		},

		// allow the parent to set my state
		componentWillReceiveProps: function(props) {
			// console.log("props", props);
			this.setState(props.member);
		},

		handleClick: function(e) {
			var member_id = e.currentTarget.getAttribute("data-member-id");
			this.state.active = !this.state.active;
			this.setState(this.state);

			this.props.onMemberClick(member_id, this.state.active);
		},

		render: function() {
			var row = this.state;
			var className = this.state.active ? "member active selected" : "member";
			return <tr className={className} data-member-id={row.memberID} onClick={this.handleClick}>
						<td>{row.memberID}</td>
						<td>"{row.cidName}" &lt;{row.cidNumber}&gt;</td>
						<td>{row.status.audio.floor ? "F" : "f"} |
							{row.status.audio.talking ? " T" : " t"} |
							{row.status.audio.deaf ? " D" : " d"} |
							{row.status.audio.muted ? " M" : " m"} |
							{row.status.audio.onHold ? " H" : " h"} |
							{row.status.audio.energyScore}
						</td>
						<td>{row.email}</td>
				</tr>;
		}
	});

	var ConferencePage = React.createClass({
		la: null,
		activeMembers: {},

		getInitialState: function() {
			return {name: this.props.name, rows: [], la: null};
		},

		getChannelName: function(what) { // liveArray chat mod
			return "conference-" + what + "." + this.props.name + "@" + domain;
		},

		handleControlClick: function(e) {
			var data = e.target.getAttribute("data");
			console.log("data", data);

			if (data == "lock") {
				fsAPI("conference", this.props.name + " lock");
			} else if (data == "unlock") {
				fsAPI("conference", this.props.name + " unlock");
			} else if (data == "select") {
				var rows = [];
				var _this = this;
				if (this.state.rows.length > 0) {
					var active = !this.state.rows[0].active;

					this.state.rows.forEach(function(row) {
						row.active = active;
						rows.push(row);
						console.log("row", row.active);
						_this.activeMembers[row.memberID] = active;
					});
					this.setState({rows: rows});
				}
				return;
			}

			for(var member in this.activeMembers) {
				if (this.activeMembers[member] == true) {
					args = this.props.name + " " + data + " " + member;
					// console.log("args", args);
					fsAPI("conference", args);
				}
			}
		},

		handleMemberClick: function(member_id, isActive) {
			console.log("member_id", member_id);
			this.activeMembers[member_id] = isActive;
		},

		componentWillMount: function() {
		},

		componentWillUnmount: function() {
			if (this.la) this.la.destroy();
		},

		componentDidMount: function() {
			console.log("name:", this.props.name);
			this.la = new $.verto.liveArray(verto, this.getChannelName("liveArray"), this.props.name, {});
			this.la.onChange = this.handleConferenceEvent;
		},

		handleConferenceEvent: function(la, a) {
			// console.log("onChange FSevent:", la);
			console.log("onChange FSevent:", a);

			switch (a.action) {

			case "init":
				break;

			case "bootObj":
				var rows = [];
				a.data.forEach(function(member) {
					rows.push(translateMember(member));
				})
				this.setState({rows: rows});
				break;

			case "add":
				var rows = this.state.rows;
				rows.push(translateMember([a.key, a.data]));
				this.setState({rows: rows});
				break;

			case "modify":
				var rows = []

				this.state.rows = this.state.rows.map(function(row) {
					if (row.uuid == a.key ) {
						var member = translateMember([a.key, a.data]);
						member.active = row.active;
						return member;
					} else {
						return row;
					}
				});

				this.setState(this.state);
				break;

			case "del":
				var rows = []

				this.state.rows.forEach(function(row) {
					if (row.uuid != a.key ) rows.push(row);
				});

				this.setState({rows: rows});
				break;

			case "clear":
				this.setState({rows: []});
				break;

			case "reorder":
				break;

			default:
				console.log("unknow action: ", a.action);
				break;
			}
		},

		render: function() {
			var _this = this;

			return <div>
				<div id="conference-controls">
					<button onClick={this.handleControlClick} data="mute">Mute</button>
					<button onClick={this.handleControlClick} data="unmute">unMute</button>
					<button onClick={this.handleControlClick} data="hup">Hup</button>
					-
					<button onClick={this.handleControlClick} data="select">Select</button>
					-
					<button onClick={this.handleControlClick} data="lock">Lock</button>
					<button onClick={this.handleControlClick} data="unlock">unLock</button>
				</div>
				<h1>Conference {this.props.name}</h1>
				<div>
					<table className="table conference">
					<tbody>
					<tr>
						<th>MemberID</th>
						<th>CID</th>
						<th>Status</th>
						<th>Email</th>
					</tr>
					{
						this.state.rows.map(function(member) {
							return <Member member={member} key={member.uuid} onMemberClick={_this.handleMemberClick} />
						})
					}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var ShowFSApplication = React.createClass({
		render: function() {
			var rows = [];
			this.props.rows.forEach(function(row) {
				rows.push(<tr key={row.name}>
					<td>{row.name }</td>
					<td>{row.description }</td>
					<td>{row.syntax }</td>
					<td>{row.ikey }</td>
				</tr>);
			});

			return <div><h1>Applications</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Syntax</th>
						<th>iKey</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var ShowFSAPI = React.createClass({
		render: function() {
			var rows = [];
			this.props.rows.forEach(function(row) {
				rows.push(<tr key={row.name}>
					<td>{row.name }</td>
					<td>{row.description }</td>
					<td>{row.syntax }</td>
					<td>{row.ikey }</td>
				</tr>);
			});

			return <div><h1>{this.props.title}</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Syntax</th>
						<th>iKey</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var ShowFSComplete = React.createClass({
		render: function() {
			var rows = [];
			this.props.rows.forEach(function(row) {
				rows.push(<tr key={row.a1}>
					<td>{row.sticky}</td>
					<td>{row.a1}</td>
					<td>{row.a2}</td>
					<td>{row.a3}</td>
					<td>{row.a4}</td>
					<td>{row.a5}</td>
					<td>{row.a6}</td>
					<td>{row.a7}</td>
					<td>{row.a8}</td>
					<td>{row.a9}</td>
					<td>{row.a10}</td>
					<td>{row.hosthame}</td>
				</tr>);
			});

			return <div><h1>{this.props.title}</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>Sticky</th>
						<th>A1</th>
						<th>A2</th>
						<th>A3</th>
						<th>A4</th>
						<th>A5</th>
						<th>A6</th>
						<th>A7</th>
						<th>A8</th>
						<th>A9</th>
						<th>A10</th>
						<th>Hostname</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var ShowFSModule = React.createClass({
		render: function() {
			var rows = [];
			this.props.rows.forEach(function(row) {
				rows.push(<tr key={row.name}>
					<td>{row.type }</td>
					<td>{row.name }</td>
					<td>{row.filename }</td>
				</tr>);
			});

			return <div><h1>{this.props.title}</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>Type</th>
						<th>Name</th>
						<th>iKey</th>
						<th>FileName</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var ShowFSRegistration = React.createClass({
		render: function() {
			var rows = [];
			this.props.rows.forEach(function(row) {
				rows.push(<tr key={row.reg_user + row.token}>
					<td>{row.reg_user }</td>
					<td>{row.realm }</td>
					<td>{row.expires }</td>
					<td>{row.network_ip }</td>
					<td>{row.network_port }</td>
					<td>{row.network_proto }</td>
					<td>{row.hostname }</td>
					<td>{row.metadata }</td>
					<td>{row.token }</td>
				</tr>);
			});

			return <div><h1>{this.props.title}</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>Reg User</th>
						<th>Realm</th>
						<th>Expires</th>
						<th>Network IP</th>
						<th>Network Port</th>
						<th>Network Proto</th>
						<th>Hostname</th>
						<th>Metadata</th>
						<th>Token / Url</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var ShowFSTasks = React.createClass({
		render: function() {
			var rows = [];
			this.props.rows.forEach(function(row) {
				rows.push(<tr key={row.task_id}>
					<td>{row.task_id }</td>
					<td>{row.task_desc }</td>
					<td>{row.task_group }</td>
					<td>{row.task_sql_manager }</td>
					<td>{row.hostname }</td>
				</tr>);
			});

			return <div><h1>{this.props.title}</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>Task ID</th>
						<th>Task Desc</th>
						<th>Task Group</th>
						<th>Task SQL Manager</th>
						<th>HostName</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var ShowFSCommon = React.createClass({
		render: function() {
			var rows = [];
			this.props.rows.forEach(function(row) {
				rows.push(<tr key={row.name}>
					<td>{row.type }</td>
					<td>{row.name }</td>
					<td>{row.ikey }</td>
				</tr>);
			});

			return <div><h1>{this.props.title}</h1>
				<div>
					<table className="table">
					<tbody>
					<tr>
						<th>Type</th>
						<th>Name</th>
						<th>iKey</th>
					</tr>
					{rows}
					</tbody>
					</table>
				</div>
			</div>
		}
	});

	var ShowFSPage = React.createClass({
		getInitialState: function() {
			return {rows: []};
		},

		componentDidMount: function() {
			var _this = this;

			showFSAPI(this.props.what, function(data) {
				var msg = $.parseJSON(data.message);
				if (msg.row_count === 0) {
					_this.setState({rows: []});
				} else {
					console.log(msg.rows);
					_this.setState({rows: msg.rows});
				};
			});
		},

		render: function() {
			if (this.props.what == "application") {
				return <ShowFSApplication rows = {this.state.rows} title = {this.props.title}/>
			} else if (this.props.what == "api") {
				return <ShowFSAPI rows = {this.state.rows} title = {this.props.title}/>
			} else if (this.props.what == "complete") {
				return <ShowFSComplete rows = {this.state.rows} title = {this.props.title}/>
			} else if (this.props.what == "module") {
				return <ShowFSModule rows = {this.state.rows} title = {this.props.title}/>
			} else if (this.props.what == "registrations") {
				return <ShowFSRegistration rows = {this.state.rows} title = {this.props.title}/>
			} else if (this.props.what == "tasks") {
				return <ShowFSTasks rows = {this.state.rows} title = {this.props.title}/>
			} else {
				return <ShowFSCommon rows = {this.state.rows} title = {this.props.title}/>
			}
		}
	});

	var SofiaPage = React.createClass({
		getInitialState: function() {
			return {
				rows: [],
				gwDetails: {name: undefined},
				profileDetails: {name: undefined}
			};
		},

		handleProfileStart: function(e) {
			var profile = e.target.getAttribute("data-action-target");
			fsAPI("sofia", "profile " + profile + " start");
		},

		handleProfileStop: function(e) {
			var profile = e.target.getAttribute("data-action-target");
			fsAPI("sofia", "profile " + profile + " stop");
		},

		handleProfileRestart: function(e) {
			var profile = e.target.getAttribute("data-action-target");
			fsAPI("sofia", "profile " + profile + " restart");
		},

		handleProfileRescan: function(e) {
			var profile = e.target.getAttribute("data-action-target");
			fsAPI("sofia", "profile " + profile + " rescan");
		},

		handleProfileMore: function(e) {
			e.preventDefault();

			var _this = this;
			var profile_name = e.target.getAttribute("data-action-target");

			if (this.state.profileDetails.name) {
				this.setState({profileDetails: {name: undefined}});
				return;
			}

			fsAPI("sofia", "xmlstatus profile " + profile_name, function(data) {
				var msg = $(data.message);
				console.log(msg);
				var profile = msg[2];
				var info = profile.firstElementChild.firstElementChild;

				var rows = [];

				rows.push({k: info.localName, v: info.innerText});

				while(info = info.nextElementSibling) {
					rows.push({k: info.localName, v: info.innerText});
				}

				_this.setState({profileDetails: {name: profile_name, rows: rows}});
			});
		},

		handleGatewayReg: function(e) {
			e.preventDefault();
			var gwname = e.target.getAttribute("data-action-target");
			fsAPI("sofia", "profile external register " + gwname);
		},

		handleGatewayUnreg: function(e) {
			e.preventDefault();

			var gwname = e.target.getAttribute("data-action-target");
			fsAPI("sofia", "profile external unregister " + gwname);
		},

		handleGatewayDelete: function(e) {
			e.preventDefault();
			var gwname = e.target.getAttribute("data-action-target");
			var _this = this;
			fsAPI("sofia", "profile external killgw " + gwname, function(data) {
				if (data.message.substr(0, 3) == "+OK") {
					console.log(gwname + "deleted, how to delete from the dom?");
					// ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(_this).parentNode);
				}
			});
		},

		handleGatewayDetail: function(e) {
			e.preventDefault();
			var _this = this;
			var gwname = e.target.getAttribute("data-action-target");

			if (this.state.gwDetails.name) {
				this.setState({gwDetails: {name: undefined}});
				return;
			}

			fsAPI("sofia", "xmlstatus gateway " + gwname, function(data) {
				var msg = $(data.message);
				var gateway = msg[2];
				var param = gateway.firstElementChild;

				var rows = [];

				var row = {}
				var gwname = param.innerText;

				rows.push({k: param.localName, v: param.innerText});

				while(param = param.nextElementSibling) {
					rows.push({k: param.localName, v: param.innerText});
				}

				_this.setState({gwDetails: {name: gwname, rows: rows}});
			});
		},

		handleFSEvent: function(v, e) {
			console.log("FSevent:", e);
			if (e.eventChannel == "FSevent.custom::sofia::gateway_state") {
				var gw = e.data["Gateway"];
				var st = e.data["State"];
				var rows = [];

				this.state.rows.forEach(function(row) {
					var r = row;
					if (row.type == "gateway" && row.name == gw) {
						r.state = st;
					}
					rows.push(r);
				});

				this.setState({rows: rows});
			} else if (e.eventChannel == "FSevent.custom::sofia::profile_start") {
				rows = [];
				var found = 0;
				var profile_name = e.data["profile_name"];

				this.state.rows.forEach(function(row) {

					if (row.type == "profile" && row.name == profile_name) {
						row.state = "RUNNING(0)";
					}
					rows.push(row);
				});

				if (!found) {
					var profile_uri = e.data["profile_uri"];
					var _this = this;

					var actions = [
						{"action": "Start",   onClick: _this.handleProfileStart},
						{"action": "Stop",    onClick: _this.handleProfileStop},
						{"action": "Restart", onClick: _this.handleProfileRestart},
						{"action": "Rescan",  onClick: _this.handleProfileRescan},
						{"action": "More",    onClick: _this.handleProfileMore}
					];

					rows.push({name: profile_name, type: "profile", data: profile_uri, state: "RUNNING(0)", actions: actions});
				}

				this.setState({rows: rows});
			}
		},

		componentDidMount: function() {
			var _this = this;

			verto.subscribe("FSevent.custom::sofia::gateway_state", {
				handler: this.handleFSEvent
			});

			verto.subscribe("FSevent.custom::sofia::profile_start", {
				handler: this.handleFSEvent
			});

			fsAPI("sofia", "xmlstatus", function(data) {
				var rows = [];
				var msg = $(data.message);

				msg.find("profile").each(function() {
					var profile = this;
					var actions = [
						{"action": "Start",   onClick: _this.handleProfileStart},
						{"action": "Stop",    onClick: _this.handleProfileStop},
						{"action": "Restart", onClick: _this.handleProfileRestart},
						{"action": "Rescan",  onClick: _this.handleProfileRescan},
						{"action": "More",    onClick: _this.handleProfileMore}
					];
					var row = {
						"name": $(profile).find("name").text(),
						"type": $(profile).find("type").text(),
						"data": $(profile).find("data").text(),
						"state": $(profile).find("state").text(),
						"actions": actions
					};
					rows.push(row);
				});

				msg.find("alias").each(function() {
					var profile = this;
					var row = {
						"name": $(profile).find("name").text(),
						"type": $(profile).find("type").text(),
						"data": $(profile).find("data").text(),
						"state": $(profile).find("state").text(),
						"actions": []
					};
					rows.push(row);
				});

				msg.find("gateway").each(function() {
					var profile = this;
					var actions = [
						{"action": "Reg",   onClick: _this.handleGatewayReg},
						{"action": "UnReg", onClick: _this.handleGatewayUnreg},
						{"action": "Delete",onClick: _this.handleGatewayDelete},
						{"action": "More",  onClick: _this.handleGatewayDetail}
					];
					var row = {
						"name": $(profile).find("name").text(),
						"type": $(profile).find("type").text(),
						"data": $(profile).find("data").text(),
						"state": $(profile).find("state").text(),
						"actions": actions
					};
					rows.push(row);
				});

				_this.setState({rows: rows});
			});
		},

		componentWillUnmount: function() {
			verto.unsubscribe("FSevent.custom::sofia::gateway_state");
			verto.unsubscribe("FSevent.custom::sofia::profile_start");
		},

		render: function() {
			var _this = this;
			var rows = [];

			this.state.rows.forEach(function(row) {
				var actions = [];

				if (row.actions) {
					var separator = <span></span>;

					row.actions.forEach(function(action) {
						actions.push(<span key={action.action}>{separator}
							<a href='#' data-action-target={row.name} onClick={action.onClick}>{action.action}</a>
						</span>);
						separator = <span> | </span>;
					});
				}

				rows.push(<tr key={row.name + '+' + row.type}>
					<td>{row.name}</td>
					<td>{row.type}</td>
					<td>{row.data}</td>
					<td>{row.state}</td>
					<td>{actions}</td>
				</tr>);

				if (_this.state.gwDetails.name == row.name) {
					var gateway_params = [];
					var gateways;

					_this.state.gwDetails.rows.forEach(function(p) {
						gateway_params.push(<li>{p.k}: {p.v}</li>);
					})

					gateways = <ul>{gateway_params}</ul>

					rows.push(<tr key={row.name + '+' + row.type + '-gateway-details'}>
						<td colSpan={5}>{gateways}</td>
					</tr>);
				} else if (_this.state.profileDetails.name == row.name) {
					var profile_params = [];
					var profiles;

					_this.state.profileDetails.rows.forEach(function(p) {
						profile_params.push(<li>{p.k}: {p.v}</li>);
					})

					profiles = <ul>{profile_params}</ul>

					rows.push(<tr key={row.name + '+' + row.type + '-profile-details'}>
						<td colSpan={5}>{profiles}</td>
					</tr>);
				}
			});

			return <div><h1>Sofia</h1>
				<table className="table">
				<tbody>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Data</th>
					<th>State</th>
					<th>Action</th>
				</tr>
				{rows}
				</tbody>
				</table>
			</div>;
		}
	});

	var Phone = React.createClass({
		getInitialState: function() {
			return {
				displayState: false,
				loginState: false,
				callState: "Idle",
				curCall: null,
				cidName: "Anonymouse",
				cidNum: "000000",
				dtmfVisible: false
			};
		},

		handleMenuClick: function() {
			this.setState({displayState: !this.state.displayState});
		},

		handleVertoLogin: function() {
			this.setState({loginState: true});
		},

		handleVertoDialogState: function(e) {
			var d = e.detail;

			this.setState({curCall: d});

			switch (d.state) {
			case $.verto.enum.state.ringing:
				this.setState({callState: "Ringing"});
				this.setState({cidNum: d.params.caller_id_number});
				break;
			case $.verto.enum.state.trying:
				this.setState({callState: "Trying"});
				break;
			case $.verto.enum.state.early:
				this.setState({callState: "Early"});
				break;
			case $.verto.enum.state.active:
				this.setState({callState: "Active"});
				this.setState({cidName: d.cidString()});
				break;
			case $.verto.enum.state.hangup:
				this.setState({callState: "Idle"});
				this.setState({hangupCause: d.cause});
				break;
			case $.verto.enum.state.destroy:
				this.setState({hangupCause: null});
				this.setState({curCall: null});
				break;
			case $.verto.enum.state.held:
				break;
			default:
			}
		},

		handleCall: function() {
			verto.newCall({
				destination_number: $('#dest_number').val(),
				caller_id_name: '0000',
				caller_id_number: '0000',
				useVideo: false,
				useStereo: false
			});
		},

		handleHangup: function() {
			this.state.curCall.hangup();
		},

		handleAnswer: function() {
			this.state.curCall.answer();
		},

		handleDTMF: function(e) {
			dtmf = e.target.getAttribute("data-dtmf");

			if (!dtmf) {
				this.setState({dtmfVisible: !this.state.dtmfVisible});
			} else {
				this.state.curCall.dtmf(dtmf);
			}
		},

		componentDidMount: function() {
			window.addEventListener("verto-login", this.handleVertoLogin);
			window.addEventListener("verto-dialog-state", this.handleVertoDialogState);
		},

		render: function() {
			var state;
			var hangupButton = "";
			var answerButton = "";
			var toggleDTMF = <button onClick={this.handleDTMF}>DTMF</button>;
			var DTMFs = <div style={{display: this.state.dtmfVisible ? "block" : "none"}}>
				<button onClick={this.handleDTMF} data-dtmf="0">0</button>
				<button onClick={this.handleDTMF} data-dtmf="1">1</button>
				<button onClick={this.handleDTMF} data-dtmf="2">2</button>
				<button onClick={this.handleDTMF} data-dtmf="3">3</button>
				<button onClick={this.handleDTMF} data-dtmf="4">4</button>
				<button onClick={this.handleDTMF} data-dtmf="5">5</button>
				<button onClick={this.handleDTMF} data-dtmf="6">6</button>
				<button onClick={this.handleDTMF} data-dtmf="7">7</button>
				<button onClick={this.handleDTMF} data-dtmf="8">8</button>
				<button onClick={this.handleDTMF} data-dtmf="9">9</button>
				<button onClick={this.handleDTMF} data-dtmf="*">*</button>
				<button onClick={this.handleDTMF} data-dtmf="#">#</button>
			</div>;

			if (this.state.loginState) {
				state = "Online";
			} else {
				state = "Offline"
			}

			if (this.state.callState != "Idle") {
				hangupButton = <button onClick={this.handleHangup}>Hangup</button>
			}

			if (this.state.callState == "Ringing" && this.state.cidNum != "1000") {
				$('#web-phone').css('display', 'block');
				answerButton = <button onClick={this.handleAnswer}>Answer</button>
			}

			return 	<ul className="nav navbar-nav navbar-right">
				<li><a className={state} href="#" onClick={this.handleMenuClick}>Phone</a></li>
				<div id="web-phone" style={{display: this.state.displayState ? "block" : "none"}}>
					Phone....<br/>
					<input id="dest_number" name="dest_number" defaultValue="demo"/>
					<button onClick={this.handleCall}>Call</button>
					<br/>
					<span>{this.state.cidname} {this.state.callState}</span>
					{hangupButton}
					{answerButton}
					{toggleDTMF}
					{DTMFs}
				</div>
				<video id="webcam" style={{display: "none"}}/>
			</ul>;
		}

	});

	/* ------------------------------------------------------------ */

	var MENUS = [
		{id: "MM_DASHBOARD", description: 'Dashboard', data: ''},
		{id: "MM_SHOW", description: 'Show', data: 'show'},
		{id: "MM_BLOCKS", description: 'Blocks'},
		{id: "MM_CONFERENCES", description: 'Conferences', data: 'conferences'},
		{id: "MM_ABOUT", description: 'About', data: 'about'}
	];

	var RMENUS = [
		{id: "MM_SETTINGS", description: 'Settings'},
		{id: "MM_PROFILE", description: 'Profile'},
		{id: "MM_HELP", description: 'Help'}
	];

	var NAVLIST = [
		{id: "M_OVERVIEW", description: 'OverView'},
		{id: "M_CALLS", description: 'Calls'},
		{id: "M_CHANNELS", description: 'Channels'},
		{id: "M_USERS", description: 'Users'},
		{id: "M_SOFIA", description: 'Sofia'}
	]

// });
