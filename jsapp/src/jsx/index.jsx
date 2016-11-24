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
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import Conferences from './conferences';
import Settings from './settings';
import Users from './page_users';
import Routes from './page_routes';
import Blocks from './blocks.js';

var lang_map = detect_language();
if (lang_map) T.setTexts(lang_map);

var MENUS = [
	{id: "MM_DASHBOARD", description: <T.span text={{ key: "DashBoard"}} />, data: '/'},
	{id: "MM_SHOW", description: <T.span text={{ key: "Show"}} />, data: '/show'},
	{id: "MM_BLOCKS", description: <T.span text={{ key: "Blocks"}} />, data: '/blocks'},
	{id: "MM_CONFERENCES", description: <T.span text={{ key: "Conferences"}} />, data: '/conferences'},
	{id: "MM_ABOUT", description: <T.span text={{ key: "About"}} />, data: '/about'}
];

var RMENUS = [
	{id: "MM_SETTINGS", description: <T.span text="Settings" />, data: "/settings/users"},
	// {id: "MM_PROFILE", description: <T.span text={{ key: "Profiles"}} />, data:"/profiles"},
	{id: "MM_HELP", description: <T.span text="Help"/>, data: "/help"}
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
		return <div><MainMenu menus = {MENUS} rmenus = {RMENUS}/>
			<div id='main'>{this.props.children}</div>
				<Footer/>
			</div>
		}
})


$(document).ready(function() {

ReactDOM.render(<Router history={hashHistory}>
	<Route path="/" component={App}>
		<IndexRoute component={DashBoard}/>
		<Route path="show" component={FSShow} />
		<Route path="about" component={AboutPage} />
		<Route path="blocks" component={Blocks} />
		<Route path="conferences" component={Conferences} />

		<Route path="settings" component={Settings}>
		    <IndexRoute component={Users}/>
			<Route path="users" />
			<Route path="routes" component={Routes} />
		</Route>
	</Route>
</Router>, document.getElementById('body'))

});
