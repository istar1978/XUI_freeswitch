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
