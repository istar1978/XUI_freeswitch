var BlocksPage = React.createClass({
	// overview is so special because it must wait the websocket connected before it can get any data
	getInitialState: function() {
		return {msg: "connecting ..."};
	},

	handleClick: function(x) {
	},

	componentWillMount: function() {
		// listen to "update-status" event
		window.addEventListener("update-status", this.handleUpdateStatus);
	},

	componentWillUnmount: function() {
		window.removeEventListener("update-status", this.handleUpdateStatus);
	},

	componentDidMount: function() {
		if (this.props.auto_update) {
			var _this = this;
			fsStatus(function(s) {
				_this.setState({msg: s});
			})
		}
	},

	handleUpdateStatus: function(e) {
		// console.log("eeee", e.detail);
		this.setState({msg: e.detail.message});
	},

	render: function() {
		return <div><pre>Blah</pre></div>;
	}
});


$(document).ready(function(){

	React.render(<MainMenu menus = {MENUS} rmenus = {RMENUS}/>,
		document.getElementById('mainMenu'));

	// React.render(<NavBar items = {NAVLIST} />,
	// 	document.getElementById('sidebar'));

	// React.render(<BlocksPage/>,
		// document.getElementById('main')
	// );
});
