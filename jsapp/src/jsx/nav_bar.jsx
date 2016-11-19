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
 * nav_bar.jsx - Nav Bar
 *
 */

	var NavItem = React.createClass({
		getInitialState: function() {
			return this.props.item;
		},

		handleClick: function(e) {
			// console.log("target", e.target);
			this.props.resetALL(e.currentTarget.getAttribute("data-item-id"));

			if (this.props.item.id == "M_OVERVIEW") {
				ReactDOM.render(<OverViewPage auto_update={true}/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_CALLS") {
				ReactDOM.render(<CallsPage/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_CHANNELS") {
				ReactDOM.render(<ChannelsPage/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_USERS") {
				ReactDOM.render(<UsersPage/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_SOFIA") {
				ReactDOM.render(<SofiaPage/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_SET_USERS") {
				ReactDOM.render(<UsersPage/>, document.getElementById("main"));
			} else if (this.props.item.id == "M_SET_ROUTES") {
				ReactDOM.render(<RoutesPage/>, document.getElementById("main"));
			} else if (this.props.item.id.substring(0, 7) == "M_SHOW_") {
				var what = this.props.item.id.substr(7);
				ReactDOM.render(<div></div>, document.getElementById("main"));
				ReactDOM.render(<ShowFSPage what={what} title={this.props.item.description}/>, document.getElementById("main"));
			} else if (this.props.item.id.substring(0, 7) == "M_CONF_") {
				ReactDOM.render(<div></div>, document.getElementById("main"));
				ReactDOM.render(<ConferencePage name={this.props.item.data} title={this.props.item.description}/>, document.getElementById("main"));
			} else {
				ReactDOM.render(<span>{this.props.item.description}</span>, document.getElementById('main'));
			}
		},

		render: function() {
			var className = this.props.active ? "active" : "";
			return <li className={className}><a href="#" data-item-id={this.props.item.id} onClick={this.handleClick}>{this.props.item.description}</a></li>;
		}
	});

	var NavBar = React.createClass({
		getInitialState: function() {
			return {
				items: this.props.items,
				activeItem: this.props.items[0].id
			};
		},

		resetALL: function(item_id) {
			this.setState({activeItem: item_id});
		},

		render: function() {
			var _this = this;
			items = [];

			this.state.items.forEach(function(item) {
				console.log("handleClick", this.handleClick);
				items.push(<NavItem item={item} key={item.id} active={item.id == _this.state.activeItem} resetALL={_this.resetALL}/>);
			});

			return (
				<ul className="nav nav-sidebar" id="nav-sidebar">
					{items}
				</ul>
			);
		}

	});
