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

import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';
import DashBoard from "./dashboard";
import FSShow from './fs_show';
import Conferences from './conferences';
import AboutPage from './page_about';
import Phone from './phone';

class MainMenu extends React.Component {

	handleSelect(k, e) {
		console.log("key", k);
		console.log("event", e);

		if (k == "MM_DASHBOARD") {
			ReactDOM.render(<DashBoard/>, document.getElementById('main'));
		} else if (k == "MM_SHOW") {
			ReactDOM.render(<FSShow/>, document.getElementById('main'));
		} else if (k == "MM_BLOCKS") {
			window.location = "/blocks.html";
		} else if (k == "MM_CONFERENCES") {
			ReactDOM.render(<Conferences/>, document.getElementById('main'));
		} else if (k == "MM_ABOUT") {
			ReactDOM.render(<AboutPage/>, document.getElementById('main'));
		} else {
			ReactDOM.render(<div>{k}</div>, document.getElementById('main'));
		}
	}

	render() {
		var menus = this.props.menus.map(function(item) {
			return <NavItem eventKey={item.id} key={item.id}>{item.description}</NavItem>;
		});

		var rmenus = this.props.rmenus.map(function(item) {
			return <NavItem eventKey={item.id} key={item.id}>{item.description}</NavItem>;
		});

		return <Navbar inverse fixedTop staticTop onSelect={this.handleSelect}>
			<Navbar.Header>
				<Navbar.Brand>
					<a href="#"><img src="/assets/img/xui.png" style={{height: "24px"}}/></a>
				</Navbar.Brand>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				<Nav>{ menus }</Nav>
				<Nav pullRight>{ rmenus }</Nav>
				<Nav pullRight><Phone /></Nav>
			</Navbar.Collapse>
		</Navbar>;
	}
}

export default MainMenu;
