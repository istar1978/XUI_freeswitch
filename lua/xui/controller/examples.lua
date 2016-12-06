content_type("application/json")

get('/', function(params)
	local tabs = {}
	local tab = {id= 1, name = 'name'}

	table.insert(tabs, tab)

	tab = {id= 2, name = 'name'}
	table.insert(tabs, tab)

	tab = {id= 3, name = 'name'}
	table.insert(tabs, tab)

	return tabs
end)

get('/:id', function(params)
	local tab = {id= params.id, name = "name"}
	return tab
end)

post('/', function(params)
	print(serialize(params))

	return {id = 1}
end)

delete('/', function(params)

	return 200
end)
