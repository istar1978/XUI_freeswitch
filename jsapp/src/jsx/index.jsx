$(document).ready(function(){

	React.render(<MainMenu menus = {MENUS} rmenus = {RMENUS}/>,
		document.getElementById('mainMenu'));

	React.render(<NavBar items = {NAVLIST} />,
		document.getElementById('sidebar'));

	React.render(<OverViewPage/>,
		document.getElementById('main')
	);
});
