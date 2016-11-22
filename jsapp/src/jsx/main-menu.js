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
import { Router, Route, Link, browserHistory } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import Phone from './phone';

class MainMenu extends React.Component {
	render() {
		var menus = this.props.menus.map(function(item) {
			return <LinkContainer to={item.data} key={item.id}>
				<NavItem eventKey={item.id}>{item.description}</NavItem>
			</LinkContainer>
		});

		var rmenus = this.props.rmenus.map(function(item) {
			return <LinkContainer to={item.data} key={item.id}>
				<NavItem eventKey={item.id}>{item.description}</NavItem>
			</LinkContainer>
		});

		return <Navbar inverse fixedTop staticTop>
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
