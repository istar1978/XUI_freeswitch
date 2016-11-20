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
