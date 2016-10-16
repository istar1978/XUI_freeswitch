$(document).ready(function(){

	React.render(React.createElement(MainMenu, {menus: MENUS, rmenus: RMENUS}),
		document.getElementById('mainMenu'));

	React.render(React.createElement(NavBar, {items: NAVLIST}),
		document.getElementById('sidebar'));

	React.render(React.createElement(OverViewPage, null),
		document.getElementById('main')
	);
});
