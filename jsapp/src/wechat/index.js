'use strict';

import React from 'react'
import ReactDOM from 'react-dom';
import T from 'i18n-react';
import { xFetchJSON } from '../jsx/libs/xtools';

var is_wx_ready = false;
var to_tid = ''

const ticket_status = {
	"TICKET_ST_NEW": "未处理",
	"TICKET_ST_PROCESSING": "处理中",
	"TICKET_ST_DONE": "已完成"
}

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {ticket: {}, users: [], user_options: null, ticket_comments: [], deal_user: null};
	}

	componentDidMount() {
		var _this = this;

		xFetchJSON("/api/tickets/" + current_ticket_id).then((data) => {
			console.log("ticket", data);
			_this.setState({ticket: data});

			// todo fix hardcoded
			const uri = "http://xswitch.cn/api/wechat/xyt/tickets/" + data.id;

			var shareData = {
				title: data.subject,
				desc: data.content.substr(0, 40),
				link: uri,
				imgUrl: 'http://xswitch.cn/assets/img/ticket.png',
				trigger: function (res) {
					// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
					console.log('用户点击发送给朋友');
				},
				success: function (res) {
					console.log('已分享');
				},
				cancel: function (res) {
					console.log('已取消');
				},
				fail: function (res) {
					console.log('failed', res);
				}
			};

			if (is_wx_ready) {
				wx.onMenuShareAppMessage(shareData);
			} else {
				wx.ready(function() {
					wx.onMenuShareAppMessage(shareData);
				});
			}
		}).catch((e) => {
			console.error("get ticket", e);
		});

		xFetchJSON('/api/tickets/' + current_ticket_id + '/comments').then((data) => {
			console.log('comments', data);
			_this.setState({ticket_comments: data});
		});
	}

	handleComment(e) {
		to_tid = e;
		ReactDOM.render(<Comment/>, document.getElementById('main'));
	}
	
	handleAllot() {
		ReactDOM.render(<Userlist/>, document.getElementById('main'));
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
					
					<div className="weui-form-preview__item">
						<span className="weui-form-preview__label">
							<h4 className="weui-media-box__title">{comment.user_name}:</h4>
							<p className="weui-media-box__desc">{comment.content}</p>
						</span>
						<span className="weui-form-preview__value" style={{fontSize:"12px",float:"right",color:"gray"}}>{ticket.created_epoch}</span>
						</div>
					</div>
				</a>
		})
		return <div>
			<div className="weui-cells__title">
				<h1 style={{ textAlign:"center" }}>{ticket.subject}</h1>
			{/* <p>
					{ticket.content}
			</p> */}
			</div>
		<div className="weui-form-preview">
			<div className="weui-form-preview__bd">
				<div className="weui-form-preview__item">
					<span style={{color:"black"}} className="weui-form-preview__label">时间</span>
					<span className="weui-form-preview__value">{ticket.created_epoch}</span>
				</div>
			</div>
			
			
			<div className="weui-form-preview__ft">
			</div>
			<div className="weui-form-preview__bd">
				<div className="weui-form-preview__item">
					<span style={{color:"black"}} className="weui-form-preview__label">派单人</span>
					<span className="weui-form-preview__value">{ticket.user_name}</span>
				</div>
			</div>
			
			<div className="weui-form-preview__ft">
			</div>
			<div className="weui-form-preview__bd">
				<div className="weui-form-preview__item">
					<span style={{color:"black"}} className="weui-form-preview__label">执行人</span>
					<span className="weui-form-preview__value">{ticket.current_user_name}</span>
				</div>
			</div>
			
			<div className="weui-form-preview__ft">
			</div>
			<div className="weui-form-preview__bd">
				<div className="weui-form-preview__item">
					<span style={{color:"black"}} className="weui-form-preview__label">类型</span>
					<span className="weui-form-preview__value"><T.span text={ticket.type}/></span>
				</div>
			</div>
			
			<div className="weui-form-preview__ft">
			</div>
			<div className="weui-form-preview__bd">
				<div className="weui-form-preview__item">
					<span style={{color:"black"}} className="weui-form-preview__label">状态</span>
					<span className="weui-form-preview__value">{ticket_status[ticket.status]}</span>
				</div>
			</div>
			
		</div>
		<article className="weui-article">
			<section>
				<p>{ticket.content}</p>
			</section>
		</article>
		{/* <a className="weui-form-preview__btn weui-form-preview__btn_primary" onClick={ () => _this.handleAllot()}>派发</a> */}
			<a className="weui-form-preview__btn weui-form-preview__btn_primary" onClick={() => _this.handleComment(ticket.id)}>添加评论</a>
			{/* <div className="weui-cells weui-cells_form">
				<div className="weui-cell">
					<div className="weui-cell__bd">
						<textarea className="weui-textarea" placeholder="请输入内容" onChange={this.handleInput.bind(this)} rows="3"></textarea>
					</div>
				</div>
			</div> */}
		{/*  <div className="weui-btn-area" onClick={this.handleSubmit.bind(this)}>
			<a className="weui-btn weui-btn_primary" href="javascript:" id="showTooltips">提交</a>
		</div> */}
		<div className="weui-panel weui-panel_access">
			<div className="weui-panel__bd">
			{comments}
			</div>
		</div>
		</div>
	}
}

class Userlist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {wechat_users: []};

	}

	componentDidMount() {
		xFetchJSON("/api/wechat_users").then((data) => {
			console.log("wechat_users", data)
			this.setState({wechat_users: data})
		}).catch((msg) => {
			
		});
	}

	render(){
		var wechat_users = this.state.wechat_users.map(function(row) {
			return <div className="weui-form-preview">
						<a className="weui-media-box weui-media-box_appmsg" key="">
							<div className="weui-media-box__hd">
								<img className="weui-media-box__thumb" src={row.headimgurl} alt=""/>
							</div>
							<div className="weui-media-box__bd">
								<div className="weui-form-preview__item">
									<span className="weui-form-preview__value" style={{fontSize:"12px",color:"black"}}>{row.name}&nbsp;&nbsp;&nbsp;{row.extn}&nbsp;&nbsp;&nbsp;{row.nickname}</span>
								</div>
							</div>
						</a>
					</div>
				})
		
		
		return <div>
			<div className="weui-form-preview__bd">
				<div className="weui-form-preview__item">
					<span style={{color:"black"}} className="weui-form-preview__label">选择用户</span>
				</div>
			</div>
			{wechat_users}
		</div>
	}
}

class Comment extends React.Component {
	constructor(props) {
		super(props);
		this.state = {ticket_comments: [], content: []};
	}
	
	componentDidMount() {
		xFetchJSON("/api/tickets/" + to_tid).then((data) => {
			console.log("comments_aaaaa", data)
			this.setState({content: data})
		}).catch((msg) => {
			
		});
	}
	
	handleInput(e) {
		console.log('input', e.target.value);
		this.state.comment_content = e.target.value;
	}

	addComments(e) {
		console.log('submit', this.state.comment_content);
		if(this.state.comment_content){
			xFetchJSON("/api/tickets/" + to_tid + "/comments", {
				method: 'POST',
				body: JSON.stringify({content: this.state.comment_content})
			}).then((data) => {
				current_ticket_id = to_tid;
				ReactDOM.render(<Home/>, document.getElementById('main'));
			}).catch((e) => {
			
			});
		}
	}
	
	render(){
		const _this = this;
		const comments = this.state.ticket_comments.map((comment) => {
			return <a className="weui-media-box weui-media-box_appmsg" key={comment.id}>
					<div className="weui-media-box__hd">
						<img className="weui-media-box__thumb" src={comment.avatar_url} alt=""/>
					</div>
					<div className="weui-media-box__bd">
					
					<div className="weui-form-preview__item">
						<span className="weui-form-preview__label">
							<h4 className="weui-media-box__title">{comment.user_name}:</h4>
							<p className="weui-media-box__desc">{comment.content}</p>
						</span>
						<span className="weui-form-preview__value" style={{fontSize:"12px",float:"right",color:"gray"}}>{comment.created_epoch}</span>
						</div>
					</div>
				</a>
		})
		
		
		return <div className="weui-form-preview">
				<div className="weui-form-preview__bd">
					<div className="weui-form-preview__item">
						<span style={{color:"black"}} className="weui-form-preview__label">类型</span>
						<span className="weui-form-preview__value">{this.state.content.type}</span>
					</div>
				</div>
				<div className="weui-form-preview__ft">
				</div>
				<div className="weui-form-preview__bd">
					<div className="weui-form-preview__item">
						<span style={{color:"black"}} className="weui-form-preview__label">状态</span>
						<span className="weui-form-preview__value">{ticket_status[this.state.content.status]}</span>
					</div>
				</div>
				<div className="weui-form-preview__ft">
				</div>
				<article className="weui-article">
					<section>
						<p>{this.state.content.content}</p>
					</section>
				</article>
				{/* <a className="weui-form-preview__btn weui-form-preview__btn_primary">派发</a>
				<br/> */}
				<div className="weui-cells weui-cells_form">
				  <div className="weui-cell">
					<div className="weui-cell__bd">
					  <textarea className="weui-textarea" placeholder="请输入内容" onChange={this.handleInput.bind(this)} rows="3"></textarea>
					</div>
				  </div>
				</div>
				<div className="weui-cells weui-cells_form">
					<a href="javascript:;" className="weui-btn weui-btn_primary" onClick={ () => _this.addComments()}>添加评论</a>
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
			return <div className="weui-panel__bd" onClick={() => _this.handleClick(ticket.id)} key={ticket.id} >
					<div className="weui-media-box weui-media-box_text">
						<h4 className="weui-media-box__title">{ticket.subject}</h4>
						<p className="weui-media-box__desc">{ticket.content}</p>
						<ul className="weui-media-box__info">
							<li className="weui-media-box__info__meta">来电:{ticket.cid_number}</li>
							<li className="weui-media-box__info__meta">时间:{ticket.created_epoch}</li>
							<li className="weui-media-box__info__meta">状态:{ticket_status[ticket.status]}</li>
						</ul>
					</div>
					<div className="weui-form-preview__ft"></div>
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
			<div style={{width:"100%",height:"50px"}}></div>
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
					<a className="weui-tabbar__item">
						<div className="weui-tabbar__icon">
							<img src="http://weui.github.io/weui/images/icon_nav_cell.png" alt=""/>
						</div>
						<p className="weui-tabbar__label">设置</p>
					</a>
				</div>
			</div>
	}
}

wx.ready(function () {
	console.log("wx ready!");
	is_wx_ready = true;

	const shareData = {
		title: '小樱桃工单',
		desc: '小樱桃工单',
		link: location.href.split('#')[0] + 1,
		imgUrl: 'http://xswitch.cn/assets/img/ticket.png'
	};

	wx.onMenuShareAppMessage(shareData);
});

xFetchJSON('/api/wechat/xyt/jsapi_ticket?url=' + escape(location.href.split('#')[0])).then((data) => {
	console.log('signPackage', data);
	wx.config({
		// debug: true,
		appId: data.appId,
		timestamp: data.timestamp,
		nonceStr: data.nonceStr,
		signature: data.signature,
		jsApiList: [
			'checkJsApi',
			'openLocation',
			'getLocation',
			'onMenuShareTimeline',
			'onMenuShareAppMessage'
		]
	});
});

ReactDOM.render(<Home/>, document.getElementById('main'));
ReactDOM.render(<App/>, document.getElementById('body'));
