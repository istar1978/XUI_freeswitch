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
import ReactDOM from 'react-dom';
import MainMenu from './main-menu';
import SideBar from "./sidebar";
import DashBoard from "./dashboard";

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

ReactDOM.render(<MainMenu menus = {MENUS} rmenus = {RMENUS}/>,
	document.getElementById('mainMenu'));

ReactDOM.render(<DashBoard/>, document.getElementById('main'));
