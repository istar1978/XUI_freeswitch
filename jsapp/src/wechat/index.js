'use strict';

import React from 'react'
import ReactDOM from 'react-dom';
import T from 'i18n-react';
import { xFetchJSON } from '../jsx/libs/xtools';


class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {ticket: {},signPackage:[], users: [], user_options: null, ticket_comments: [], deal_user: null};
	}

	componentDidMount() {
		var _this = this;

		xFetchJSON("/api/tickets/" + current_ticket_id).then((data) => {
			console.log("ticket", data);
			_this.setState({ticket: data});
		}).catch((e) => {
			console.error("get ticket", e);
		});

		xFetchJSON('/api/tickets/' + current_ticket_id + '/comments').then((data) => {
			console.log('comments', data);
			_this.setState({ticket_comments: data});
		});
		
		xFetchJSON('/api/getsign/').then((data) => {
			_this.setState({'signPackage': data})
			var signPackage = data;
		console.log('ddddddddddddddddddddd', JSON.stringify(signPackage));
		alert(signPackage.appId+'--'+signPackage.timestamp+'--'+signPackage.nonceStr+'--'+signPackage.signature);
			wx.config({
			debug: true,
			appId: "'" + signPackage.appId + "'",
			timestamp: signPackage.timestamp,
			nonceStr: "'" + signPackage.nonceStr + "'",
			signature: "'" + signPackage.signature + "'",
			jsApiList: [
				// 所有要调用的 API 都要加到这个列表中
				'checkJsApi',
				'openLocation',
				'getLocation',
				'onMenuShareTimeline',
				'onMenuShareAppMessage'
			]
		});
		
		wx.ready(function () {
			
				
			
	wx.onMenuShareAppMessage({
		title: '123',
		desc: '345',
		link: 'http://shop.x-y-t.cn',
		imgUrl: '',
		trigger: function (res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
			alert('用户点击发送给朋友');
		},
		success: function (res) {
			alert('已分享');
		},
		cancel: function (res) {
			alert('已取消');
		},
		fail: function (res) {
			alert(JSON.stringify(res));
		}
	});

	wx.onMenuShareTimeline({
		title: '123',
		link: '345',
		imgUrl: 'http://shop.x-y-t.cn',
		trigger: function (res) {
			// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
			alert('用户点击分享到朋友圈');
		},
		success: function (res) {
			alert('已分享');
		},
		cancel: function (res) {
			alert('已取消');
		},
		fail: function (res) {
			alert(JSON.stringify(res));
		}
	});
			
			
			
			
			
		});
		});
		
			
			
		wx.config({
			debug: true,
			appId: "'" + signPackage.appId + "'",
			timestamp: signPackage.timestamp,
			nonceStr: "'" + signPackage.nonceStr + "'",
			signature: "'" + signPackage.signature + "'",
			jsApiList: [
				// 所有要调用的 API 都要加到这个列表中
				'checkJsApi',
				'openLocation',
				'getLocation',
				'onMenuShareTimeline',
				'onMenuShareAppMessage'
			]
		});
		
		wx.ready(function () {
			
			
			
			
			
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

		if (!ticket.id) {
			return <div><br/><br/><br/><br/><br/><br/>
				<center>当前没有待处理工单</center>
			</div>
		}

		const comments = this.state.ticket_comments.map((comment) => {
			return <a className="weui-media-box weui-media-box_appmsg" key={comment.id}>
					<div className="weui-media-box__hd">
						<img className="weui-media-box__thumb" src={comment.avatar_url} alt=""/>
					</div>
					<div className="weui-media-box__bd">
						<h4 className="weui-media-box__title">{comment.user_name}：</h4>
						<p className="weui-media-box__desc">{comment.content}</p>
					</div>
				</a>
		})
		return <div>
			<div className="weui-cells__title">
			<article class="weui-article">
				<section>
					<section>
						<h3>{ticket.subject}</h3>
						<p>
							{ticket.content}
						</p>
					</section>
				</section>
			</article>
			<span className="weui-cell__ft">
				<audio src="{ticket.record_path}">
				</audio>
			</span>
			</div>
			<div className="weui-cells weui-cells_form">
				<div className="weui-cell">
					<div className="weui-cell__bd">
						<textarea className="weui-textarea" placeholder="请输入内容" onChange={this.handleInput.bind(this)} rows="3"></textarea>
					</div>
				</div>
			</div>
		<div className="weui-btn-area" onClick={this.handleSubmit.bind(this)}>
			<a className="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">提交</a>
		</div>
		<div className="weui-panel weui-panel_access">
			<div className="weui-panel__hd">工单详情</div>
			<div className="weui-panel__bd">
			{comments}
			</div>
		</div>
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

		xFetchJSON("/api/wechat/xyt/all").then((data) => {
			console.log("ticket", data);
			_this.setState({tickets: data});
		}).catch((e) => {
			console.error("get ticket", e);
		});
	}

	handleClick(ticket_id) {
		console.log(ticket_id);
		current_ticket_id = ticket_id;
		ReactDOM.render(<Home/>, document.getElementById('main'));
	}

	render() {
		var _this = this;
		const tickets = this.state.tickets.map((ticket) => {
			var status = '';
			if(ticket.status == 1){
				status = '未完成';
			}else{
				status = '已完成';
			}
			return <div className="weui-panel__bd" key={ticket.id}>
					<div className="weui-media-box weui-media-box_text">
						<h4 className="weui-media-box__title" onClick={() => _this.handleClick(ticket.id)}>{ticket.subject}</h4>
						<p className="weui-media-box__desc">{ticket.content}</p>
						<ul className="weui-media-box__info">
							<li className="weui-media-box__info__meta">来电:{ticket.cid_number}</li>
							<li className="weui-media-box__info__meta">时间:{ticket.created_epoch}</li>
							<li className="weui-media-box__info__meta weui-media-box__info__meta_extra">状态:{status}</li>
						</ul>
					</div>
				</div>
		});
		console.log("tickets", tickets);
		return <div className="weui-panel">
				<div className="weui-panel__hd">全部工单</div>
					{tickets}
				</div>
				
	}
}


class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {users: []};
	}
	handleInputOne(e) {
		console.log('input', e.target.value);
		this.state.extn = e.target.value;
	}
	handleInputTwo(e) {
		console.log('input', e.target.value);
		this.state.password = e.target.value;
	}
	componentDidMount() {
		var _this = this;
		xFetchJSON("/api/wechat/xyt/setting").then((data) => {
			console.log("users", data);
			_this.setState({users: data});
		}).catch((e) => {
			console.error("get ticket", e);
		});
	}
	handleSubmit() {
		console.log('submit', this.state.comment_content);
		xFetchJSON("/api/wechat/xyt/tickets", {
			method: 'POST',
			body: JSON.stringify({content: this.state.extn, content: this.state.password, id: this.state.users.id})
		}).then((data) => {
			console.log("res", data)
			
		}).catch((e) => {
			console.error("comment err", e);
		});
	}
	render() {
		var users = this.state.users;
		return <div className="weui-cells weui-cells_form">
					<div className="weui-cell">
						<div className="weui-cell__hd"><label className="weui-label">用户名</label></div>
						<div className="weui-cell__bd">
							<input name="login" className="weui-input" onChange={this.handleInputOne.bind(this)} type="text" pattern="[0-9a-zA-Z-]*" value={users.extn}/>
						</div>
					</div>

					<div className="weui-cell">
						<div className="weui-cell__hd"><label className="weui-label">密码</label></div>
						<div className="weui-cell__bd">
							<input name="pass" className="weui-input" onChange={this.handleInputTwo.bind(this)} type="password" value={users.password}/>
						</div>
					</div>
					<input type="button" value="修改绑定" className="weui-btn weui-btn_primary" onClick={this.handleSubmit.bind(this)}/>
				</div>
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
				<div className="weui-tabbar" style={{position: "fixed"}}>
					<a className="weui-tabbar__item" onClick={() => _this.handleClick("last")}>
						<div className="weui-tabbar__icon">
							<img src="http://weui.github.io/weui/images/icon_nav_button.png" alt=""/>
						</div>
						<p className="weui-tabbar__label">我的</p>
					</a>
					<a className="weui-tabbar__item" onClick={() => _this.handleClick("tickets")}>
						<div className="weui-tabbar__icon">
							<img src="http://weui.github.io/weui/images/icon_nav_article.png" alt=""/>
						</div>
						<p className="weui-tabbar__label">全部</p>
					</a>
					<a className="weui-tabbar__item" onClick={() => _this.handleClick("settings")}>
						<div className="weui-tabbar__icon">
							<img src="http://weui.github.io/weui/images/icon_nav_cell.png" alt=""/>
						</div>
						<p className="weui-tabbar__label">设置</p>
					</a>
				</div>
			</div>
	}
}


ReactDOM.render(<Home/>, document.getElementById('main'));
ReactDOM.render(<App/>, document.getElementById('body'));
