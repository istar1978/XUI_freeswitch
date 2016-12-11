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
 *
 */

'use strict';

import React from 'react';
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';

class SideBar extends React.Component {

	render() {
		var items = this.props.items.map(function(item) {
			return <NavItem eventKey={item.id} key={item.id}>{item.description}</NavItem>;
		});

		var panes = this.props.items.map(function(item) {
			return <Tab.Pane eventKey={item.id} key={item.id} unmountOnExit>{item.description}</Tab.Pane>;
		});

		return <Tab.Container id="left-tabs-example" defaultActiveKey="first">
			<Row className="clearfix">
				<Col sm={2} className="leftBar">
					<Nav bsStyle="pills" stacked>
						{items}
					</Nav>
				</Col>
				<Col sm={10}>
					<Tab.Content animation>
						{panes}
					</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>;
	}
}

export default SideBar;
