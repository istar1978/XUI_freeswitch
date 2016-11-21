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
import T from 'i18n-react';
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';
import OverViewPage from "./page_overview";
import ChannelsPage from "./page_channels";
import CallsPage from "./page_calls";
import FSUsersPage from "./page_fs_users";
import SofiaPage from "./page_sofia";

class DashBoard extends React.Component {

	render() {
		return <Tab.Container id="left-tabs-example" defaultActiveKey="M_OVERVIEW">
			<Row className="clearfix">
				<Col sm={2}>
					<br />
					<Nav bsStyle="pills" stacked>
						<NavItem eventKey="M_OVERVIEW"><T.span text={{ key: "Overview"}} /></NavItem>
						<NavItem eventKey="M_Calls"><T.span text={{ key: "Calls"}} /></NavItem>
						<NavItem eventKey="M_Channels"><T.span text={{ key: "Channels"}} /></NavItem>
						<NavItem eventKey="M_Users"><T.span text={{ key: "Users"}} /></NavItem>
						<NavItem eventKey="M_Sofia"><T.span text={{ key: "Sofia"}} /></NavItem>
					</Nav>
				</Col>
				<Col sm={10} className="leftBar">
					<Tab.Content animation>
						<Tab.Pane eventKey="M_OVERVIEW" unmountOnExit><OverViewPage/></Tab.Pane>
						<Tab.Pane eventKey="M_Calls" unmountOnExit><CallsPage/></Tab.Pane>
						<Tab.Pane eventKey="M_Channels" unmountOnExit><ChannelsPage/></Tab.Pane>
						<Tab.Pane eventKey="M_Users" unmountOnExit><FSUsersPage/></Tab.Pane>
						<Tab.Pane eventKey="M_Sofia" unmountOnExit><SofiaPage/></Tab.Pane>
					</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>;
	}
}

export default DashBoard;
