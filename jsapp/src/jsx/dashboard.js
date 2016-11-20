import React from 'react';
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';
import OverViewPage from "./page_overview";
import ChannelsPage from "./page_channels";
import CallsPage from "./page_calls";
import UsersPage from "./page_users";
import SofiaPage from "./page_sofia";

class DashBoard extends React.Component {

	render() {
		return <Tab.Container id="left-tabs-example" defaultActiveKey="M_OVERVIEW">
			<Row className="clearfix">
				<Col sm={2}>
					<br />
					<Nav bsStyle="pills" stacked>
						<NavItem eventKey="M_OVERVIEW">OverView</NavItem>
						<NavItem eventKey="M_Calls">Calls</NavItem>
						<NavItem eventKey="M_Channels">Channels</NavItem>
						<NavItem eventKey="M_Users">Users</NavItem>
						<NavItem eventKey="M_Sofia">Sofia</NavItem>
					</Nav>
				</Col>
				<Col sm={10} className="leftBar">
					<Tab.Content animation>
						<Tab.Pane eventKey="M_OVERVIEW" unmountOnExit><OverViewPage/></Tab.Pane>
						<Tab.Pane eventKey="M_Calls" unmountOnExit><CallsPage/></Tab.Pane>
						<Tab.Pane eventKey="M_Channels" unmountOnExit><ChannelsPage/></Tab.Pane>
						<Tab.Pane eventKey="M_Users" unmountOnExit><UsersPage/></Tab.Pane>
						<Tab.Pane eventKey="M_Sofia" unmountOnExit><SofiaPage/></Tab.Pane>
					</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>;
	}
}

export default DashBoard;
