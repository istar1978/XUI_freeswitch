'use strict';

import React from 'react'
import ReactDOM from 'react-dom';
import T from 'i18n-react';
import { xFetchJSON } from '../jsx/libs/xtools';
import { Modal, ButtonToolbar, ButtonGroup, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox, Col } from 'react-bootstrap';


class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {ticket: {}, users: [], user_options: null, ticket_comments: [], deal_user: null};
	}

	componentDidMount() {
		var _this = this;

		if (!current_ticket_id) return;

		xFetchJSON("/api/tickets/" + current_ticket_id).then((data) => {
			console.log("ticket", data);
			_this.setState({ticket: data});
		}).catch((e) => {
			console.error("get ticket", e);
		});

		xFetchJSON('/api/tickets/' + current_ticket_id + '/comments').then((data) => {
			this.setState({ticket_comments: data});
		});
	}

	handleInput(e) {
		console.log('input', e.target.value);
		this.state.comment_content = e.target.value;
	}

	handleSubmit() {
		console.log('submit', this.state.comment_content);
		xFetchJSON("/api/tickets/" + current_ticket_id + "/comments", {
			method: 'POST',
			body: JSON.stringify({content: this.state.comment_content, current_user_id: "1"})
		}).then((data) => {
			console.log("res", data)
			const comments = this.state.ticket_comments.unshift(data);
			this.setState({comments: comments});
		}).catch((e) => {
			console.error("comment err", e);
		});
	}

	render() {
		const _this = this;
		const ticket = this.state.ticket;

		const comments = this.state.ticket_comments.map((comment) => {
			return <li key={comment.id}>{comment.created_at} {comment.content}</li>
		})

		return <div><h1>小樱桃工单</h1>

			{current_ticket_id}

			{ticket.user_name}
			{ticket.subject}
			{ticket.content}


			<br/>

			<div className="weui-cells weui-cells_form">
				<div className="weui-cell">
					<textarea name="name" placeholder="请输入内容" onChange={this.handleInput.bind(this)}/>
				</div>
				<div className="weui-cell">
					<input type="button" value="提交" className="weui-btn weui-btn_primary" onClick={this.handleSubmit.bind(this)}/>
				</div>

			</div>

			comments<br/>

			{comments}

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
