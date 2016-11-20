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
