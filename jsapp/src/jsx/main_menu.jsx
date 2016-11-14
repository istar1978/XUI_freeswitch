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
 * main_menu.jsx - Main Menu
 *
 */

 var MainMenuItem = React.createClass({
	getInitialState: function() {
		return this.props.item;
	},

	handleClick: function(x) {
		console.log("menu", x);
		console.log("menu.target", x.target);
		console.log(this.props);
		if (this.props.item.id == "MM_HOME") {
			window.location = '/';
		} else if (this.props.item.id == "MM_DASHBOARD") {
			ReactDOM.render(<br />,
				document.getElementById('sidebar'));

			ReactDOM.render(<NavBar items = {NAVLIST} />,
				document.getElementById('sidebar'));

			ReactDOM.render(<OverViewPage auto_update={true}/>, document.getElementById("main"));
		} else if (this.props.item.id == "MM_SHOW") {
			var list = [
				{id: "M_SHOW_application", description: "Applications", data: "application"},
				{id: "M_SHOW_registrations", description: "Registrations", data: "registrations"},
				{id: "M_SHOW_module", description: "Modules"},
				{id: "M_SHOW_endpoint", description: "Endpoints"},
				{id: "M_SHOW_codec", description: "Codecs"},
				{id: "M_SHOW_file", description: "Files"},
				{id: "M_SHOW_api", description: "APIs"},
				{id: "M_SHOW_aliases", description: "Aliases"},
				{id: "M_SHOW_complete", description: "Complete"},
				{id: "M_SHOW_chat", description: "Chat"},
				{id: "M_SHOW_management", description: "Management"},
				{id: "M_SHOW_nat_map", description: "NAT Map"},
				{id: "M_SHOW_say", description: "Say"},
				{id: "M_SHOW_interfaces", description: "Interfaces"},
				{id: "M_SHOW_interface_types", description: "Interface Types"},
				{id: "M_SHOW_tasks", description: "Tasks"},
				{id: "M_SHOW_limit", description: "Limit"}
			];

			ReactDOM.render(<br/>,
				document.getElementById('sidebar'));

			ReactDOM.render(<NavBar items = {list} />,
				document.getElementById('sidebar'));

			var what = list[0].id.substr(7);
			ReactDOM.render(<div></div>, document.getElementById("main"));
			ReactDOM.render(<ShowFSPage what={what} title={list[0].description}/>, document.getElementById("main"));
		} else if (this.props.item.id == "MM_PHONE") {

		} else if (this.props.item.id == "MM_BLOCKS") {
			window.location = "/blocks.html";
		} else if (this.props.item.id == "MM_CONFERENCES") {
			// this.props.history.push('/some/path');

			var list = [
				{id: "M_CONF_3000", description: "3000-" + domain, data: "3000-" + domain},
				{id: "M_CONF_3500", description: "3500-" + domain, data: "3500-" + domain},
				{id: "M_CONF_3800", description: "3800-" + domain, data: "3800-" + domain}
			];

			ReactDOM.render(<br/>, document.getElementById('sidebar'));

			ReactDOM.render(<NavBar items = {list} />,
				document.getElementById('sidebar'));

			ReactDOM.render(<ConferencePage name = {list[0].data}/>, document.getElementById("main"));
		} else if (this.props.item.id == "MM_ABOUT") {
			ReactDOM.render(<AboutPage />, document.getElementById('main'));
		} else {
			ReactDOM.render(<span>{this.props.item.description}</span>, document.getElementById('main'));
		}
	},

	render: function() {
		var href = "#" + this.props.item.data;
		return <li><a href={href} onClick={this.handleClick}>{this.props.item.description}</a></li>;
	}
});

var MainMenu = React.createClass({

	render: function() {
		var menus = [];
		var rmenus = [];

		this.props.menus.forEach(function(item) {
			menus.push(<MainMenuItem item={item} key={item.id}/>);
		});

		this.props.rmenus.forEach(function(item) {
			rmenus.push(<MainMenuItem item={item} key={item.id}/>);
		});

		return (
		<nav className="navbar navbar-inverse navbar-fixed-top">
		<div className="container-fluid">
			<div className="navbar-header">
				<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span className="sr-only">Toggle navigation</span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
				</button>
				<a className="navbar-brand" href="#"><img src="/assets/img/xui.png" style={{height: "30px"}}/></a>
			</div>
			<div id="navbar" className="navbar-collapse collapse">
				<ul className="nav navbar-nav">
					{ menus }
				</ul>
				<ul className="nav navbar-nav navbar-right">
					{ rmenus }
				</ul>
				<Phone />
			</div>
		</div>
		</nav>
		);
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
