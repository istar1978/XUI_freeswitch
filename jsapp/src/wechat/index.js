'use strict';

import React from 'react'
import ReactDOM from 'react-dom';
import T from 'i18n-react';
import { xFetchJSON } from '../jsx/libs/xtools';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {ticket: {}, users: [], user_options: null, ticket_comments: [], deal_user: null};
	}

	componentDidMount() {
		var _this = this;

		xFetchJSON("/api/tickets/1").then((data) => {
			console.log("ticket", data);
			_this.setState({ticket: data});
		}).catch((e) => {
			console.error("get ticket", e);
		});

		xFetchJSON('/api/tickets/1/comments').then((data) => {
			console.log('addddd', data)
			this.setState({ticket_comments: data});
		});
	}

	render() {
		const ticket = this.state.ticket;

		return <div><h1>小樱桃工单</h1>

			{ticket.user_name}
			{ticket.subject}
			{ticket.content}

		</div>
	}

}

class Tickets extends React.Component {
	constructor(props) {
		super(props);
		this.state = {tickets: []};
	}

	componentDidMount() {
		var _this = this;

		xFetchJSON("/api/tickets/").then((data) => {
			console.log("ticket", data);
			_this.setState({tickets: data});
		}).catch((e) => {
			console.error("get ticket", e);
		});
	}

	render() {
		const tickets = this.state.tickets.map((ticket) => {
			return <li>{ticket.content}</li>
		});

		console.log("tickets", tickets);

		return <div>{tickets}</div>
	}
}


class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return <div>Settings</div>
	}
}

class Other extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return <div>Other</div>
	}
}

class App extends React.Component{

	handleClick(menu) {
		console.log("menu clicked": menu);

		switch(menu) {
			case "last": ReactDOM.render(<Home/>, document.getElementById('main')); break;
			case "tickets": ReactDOM.render(<Tickets/>, document.getElementById('main')); break;
			case "settings": ReactDOM.render(<Settings/>, document.getElementById('main')); break;
			case "other": ReactDOM.render(<Other/>, document.getElementById('main')); break;
			default: ReactDOM.render(<Home/>, document.getElementById('main'));
		}
	}

	render() {
		const _this = this;

		return <div>
			<div className="weui-tabbar">
				<a className="weui-tabbar__item" onClick={() => _this.handleClick("last")}>
					<div className="weui-tabbar__icon">
						<img src="http://weui.github.io/weui/images/icon_nav_button.png" alt=""/>
					</div>
					<p className="weui-tabbar__label">我的</p>
				</a>
				<a className="weui-tabbar__item" onClick={() => _this.handleClick("tickets")}>
					<div className="weui-tabbar__icon">
						<img src="http://weui.github.io/weui/images/icon_nav_msg.png" alt=""/>
					</div>
					<p className="weui-tabbar__label">全部</p>
				</a>
				<a className="weui-tabbar__item" onClick={() => _this.handleClick("settings")}>
					<div className="weui-tabbar__icon">
						<img src="http://weui.github.io/weui/images/icon_nav_article.png" alt=""/>
					</div>
					<p className="weui-tabbar__label">设置</p>
				</a>
				<a className="weui-tabbar__item" onClick={() => _this.handleClick("other")}>
					<div className="weui-tabbar__icon">
						<img src="http://weui.github.io/weui/images/icon_nav_cell.png" alt=""/>
					</div>
					<p className="weui-tabbar__label">其它</p>
				</a>
			</div>
		</div>
	}
}


ReactDOM.render(<Home/>, document.getElementById('main'));
ReactDOM.render(<App/>, document.getElementById('body'));
