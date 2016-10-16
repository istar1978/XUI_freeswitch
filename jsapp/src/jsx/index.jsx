$(document).ready(function(){

	ReactDOM.render(<MainMenu menus = {MENUS} rmenus = {RMENUS}/>,
		document.getElementById('mainMenu'));

	ReactDOM.render(<NavBar items = {NAVLIST} />,
		document.getElementById('sidebar'));

	ReactDOM.render(<OverViewPage/>,
		document.getElementById('main')
	);
});
