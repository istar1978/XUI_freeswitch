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
