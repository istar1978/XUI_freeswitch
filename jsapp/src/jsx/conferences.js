import React from 'react';
import ReactDOM from 'react-dom';

import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap';
import ConferencePage from './page_conferences';

class Conferences extends React.Component {
	constructor(props, context) {
    	super(props, context);
		var conferences = ["3000", "3500", "3800"];

    	this.state = {
    		rows: conferences
    	};
  	}

	render() {
		var items = this.state.rows.map(function(c) {
			var name = c + "-" + domain;
			return <NavItem eventKey={c} key={c}>{name}</NavItem>;
		});

		var panes = this.state.rows.map(function(c) {
			var name = c + "-" + domain;
			return <Tab.Pane eventKey={c} key={c} unmountOnExit><ConferencePage name={name}/></Tab.Pane>;
		});

		return <Tab.Container id="left-tabs-example" defaultActiveKey={this.state.rows[0]}>
			<Row className="clearfix">
				<Col sm={2}>
					<br />
					<Nav bsStyle="pills" stacked>
						{ items }
					</Nav>
				</Col>
				<Col sm={10} className="leftBar">
					<Tab.Content animation>
						{ panes }
					</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>;
	}
}

export default Conferences;
