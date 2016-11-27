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
 * blocks.jsx - Blocks Page
 *
 */

'use strict';

import React from 'react'
import T from 'i18n-react';
import Languages from "./languages";
import ReactDOM from 'react-dom';
import MainMenu from './main-menu';
import FSShow from "./fs_show";
import AboutPage from "./page_about";
import DashBoard from "./dashboard";
import OverViewPage from "./page_overview";
import ChannelsPage from "./page_channels";
import CallsPage from "./page_calls";
import FSUsersPage from "./page_fs_users";
import SofiaPage from "./page_sofia";
import { LinkContainer } from 'react-router-bootstrap';
import { Router, Route, IndexRoute, Link, hashHistory, Redirect } from 'react-router'
import Conferences from './conferences';
import Settings from './settings';
import Users from './page_users';
import Routes from './page_routes';
import Blocks from './blocks.js';
import { Row, Col } from 'react-bootstrap';

const lang_map = detect_language();
if (lang_map) T.setTexts(lang_map);

const MENUS = [
	{id: "MM_SHOW", description: <T.span text={{ key: "Show"}} />, data: '/show'},
	{id: "MM_BLOCKS", description: <T.span text={{ key: "Blocks"}} />, data: '/blocks'},
	{id: "MM_CONFERENCES", description: <T.span text={{ key: "Conferences"}} />, data: '/conferences'},
	{id: "MM_ABOUT", description: <T.span text={{ key: "About"}} />, data: '/about'}
];

const RMENUS = [
	{id: "MM_SETTINGS", description: <T.span text="Settings" />, data: "/settings/users"},
	// {id: "MM_PROFILE", description: <T.span text={{ key: "Profiles"}} />, data:"/profiles"},
	{id: "MM_LOGOUT", description: <T.span text="Logout"/>, data: "/logout"}
];

const Footer = React.createClass({
	render() {
		return <div id="footer">
			<br/><br/><br/>
			<Languages className="pull-ight"/>
			Copyright &copy; Yantai Xiaoyingtao, ALL rights reserved
			<br/><br/>
		</div>
	}
})

const App = React.createClass({
	render() {
		let main = <div></div>;

		if (this.props.children) { //compoment
			main = this.props.children;
			console.log("props1", this.props);
		} else { //components
			console.log("props2", this.props);
			main = <Row className="clearfix">
				<Col sm={2}>
					{this.props.sidebar}
				</Col>
				<Col sm={10} className="leftBar">
					{this.props.main}
				</Col>
			</Row>
		}

		return <div>
			<MainMenu menus = {MENUS} rmenus = {RMENUS}/>
			{ main }
			<Footer/>
		</div>
	}
})

const Home = React.createClass({
	render() {
		const handleLogout = function(params, replace) {
			console.log(params, replace);
			if (verto) verto.logout();
			localStorage.removeItem("username");
			localStorage.removeItem("password");
			ReactDOM.render(<Login/>, document.getElementById('body'));
		}

		return <Router history={hashHistory}>
			<Route path="/" component={App}>
				<IndexRoute components={{sidebar: DashBoard, main: OverViewPage}} />
				<Route path="overview" components={{sidebar: DashBoard, main: OverViewPage}} onlyActiveOnIndex/>
				<Route path="calls" components = {{sidebar: DashBoard, main: CallsPage}}/>
				<Route path="channels" components = {{sidebar: DashBoard, main: ChannelsPage}}/>
				<Route path="users" components = {{sidebar: DashBoard, main: FSUsersPage}}/>
				<Route path="sofia" components = {{sidebar: DashBoard, main: SofiaPage}}/>

				<Route path="show" component={FSShow} />

				<Route path="about" component={AboutPage} />
				<Route path="logout" component={LoginBox} onEnter={handleLogout}/>
				<Route path="blocks" component={Blocks} />
				<Route path="conferences" component={Conferences} />

				<Route path="settings">
				    <IndexRoute components={{sidebar: Settings, main: Users}}/>
					<Route path="users" components={{sidebar: Settings, main: Users}}>
						<Route path=":id" component={AboutPage}/>
					</Route>
					<Route path="routes" components={{sidebar: Settings, main: Routes}}/>
				</Route>
			</Route>
		</Router>
	}
})

const LoginPage = React.createClass({
	render() {
		var menus = [{id: "MM_LOGIN", description: <T.span text={{ key: "Login"}} />, data: '/'}];
		return <div><MainMenu menus = {menus} rmenus = {[]}/>
			<div id='main'>{this.props.children}</div>
			<Footer/>
		</div>
	}
})

const LoginBox = React.createClass({
	getInitialState: function() {
		return {login_err: false};
	},

	handleClick: function() {
		let username = $('#username').val();
		let password = $('#password').val();
		localStorage.setItem('username', username);
		localStorage.setItem('password', password);
		verto.loginData(verto_params());
		verto.login();
	},

	componentDidMount: function() {
		window.addEventListener("verto-login", this.handleVertoLogin);
		window.addEventListener("verto-login-error", this.handleVertoLoginError);
	},

	componentWillUnmount: function() {
		window.removeEventListener("verto-login", this.handleVertoLogin);
		window.removeEventListener("verto-login-error", this.handleVertoLoginError);
	},

	handleVertoLogin: function(e) {
		ReactDOM.render(<Home/>, document.getElementById('body'))
	},

	handleVertoLoginError: function(e) {
		this.setState({login_err: true});
	},

	render() {
		var errmsg = this.state.login_err ? "Invalid username or password" : "";
		return <div id='loginbox'>
			<br/><T.span text={errmsg} className="danger"/>
			<h1><T.span text="Login with username and password"/></h1>
			<p><input id='username' name='username' placeholder='username'/></p>
			<p><input id='password' name='password' type='password' placeholder='password'/></p>
			<T.button onClick={this.handleClick} text="Login"/>
		</div>
	}
})

const Login = React.createClass({
	render() {
		return <Router history={hashHistory}>
			<Route path="/" component={LoginPage}>
				<IndexRoute component={LoginBox}/>
				<Redirect from="/logout" to="/"/>
				<Route path="/:any" component={LoginBox}/>
				<Route path="/:any/:more" component={LoginBox}/>
				<Route path="/:any/:more/:more" component={LoginBox}/>
			</Route>
		</Router>
	}
})

$(document).ready(function() {
	ReactDOM.render(<Login/>, document.getElementById('body'));
});
