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
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';
import ShowFSPage from './page_show';

class FSShow extends React.Component {

	handleSelect(k) {
		console.log(k);
	}

	render() {
		return <Tab.Container id="left-tabs-example" defaultActiveKey="M_SHOW_application" onSelect={this.handleSelect}>
			<Row className="clearfix">
				<Col sm={2} className="leftBar">
					<Nav bsStyle="pills" stacked>
						<br />
						<NavItem eventKey="M_SHOW_application">Applications</NavItem>
						<NavItem eventKey="M_SHOW_registrations">Registrations</NavItem>
						<NavItem eventKey="M_SHOW_module">Modules</NavItem>
						<NavItem eventKey="M_SHOW_endpoint">Endpoints</NavItem>
						<NavItem eventKey="M_SHOW_codec">Codecs</NavItem>
						<NavItem eventKey="M_SHOW_file">Files</NavItem>
						<NavItem eventKey="M_SHOW_api">APIs</NavItem>
						<NavItem eventKey="M_SHOW_aliases">Aliases</NavItem>
						<NavItem eventKey="M_SHOW_complete">Complete</NavItem>
						<NavItem eventKey="M_SHOW_chat">Chat</NavItem>
						<NavItem eventKey="M_SHOW_management">Management</NavItem>
						<NavItem eventKey="M_SHOW_nat_map">NAT Map</NavItem>
						<NavItem eventKey="M_SHOW_say">Say</NavItem>
						<NavItem eventKey="M_SHOW_interfaces">Interfaces</NavItem>
						<NavItem eventKey="M_SHOW_interface_types">Interface Types</NavItem>
						<NavItem eventKey="M_SHOW_tasks">Tasks</NavItem>
						<NavItem eventKey="M_SHOW_limit">Limit</NavItem>
					</Nav>
				</Col>
				<Col sm={10}>
					<Tab.Content animation>
						<Tab.Pane eventKey="M_SHOW_application" unmountOnExit><ShowFSPage what="application" title="Applications"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_registrations" unmountOnExit><ShowFSPage what="registrations" title="Registrations"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_module" unmountOnExit><ShowFSPage what="modules" title="Modules"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_endpoint" unmountOnExit><ShowFSPage what="endpoint" title="Endpoints"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_codec" unmountOnExit><ShowFSPage what="codec" title="Codecs"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_file" unmountOnExit><ShowFSPage what="file" title="Files"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_api" unmountOnExit><ShowFSPage what="api" title="APIs"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_aliases" unmountOnExit><ShowFSPage what="aliases" title="Aliases"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_complete" unmountOnExit><ShowFSPage what="complete" title="Completes"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_chat" unmountOnExit><ShowFSPage what="chat" title="Chat"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_management" unmountOnExit><ShowFSPage what="management" title="Management"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_nat_map" unmountOnExit><ShowFSPage what="nat_map" title="NAT Maps"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_say" unmountOnExit><ShowFSPage what="say" title="Says"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_interfaces" unmountOnExit><ShowFSPage what="interfaces" title="Interfaces"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_interface_types" unmountOnExit><ShowFSPage what="interface_types" title="Interface Types"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_tasks" unmountOnExit><ShowFSPage what="tasks" title="Tasks"/></Tab.Pane>
						<Tab.Pane eventKey="M_SHOW_limit" unmountOnExit><ShowFSPage what="limit" title="Limits"/></Tab.Pane>

					</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>;
	}
}

export default FSShow;
