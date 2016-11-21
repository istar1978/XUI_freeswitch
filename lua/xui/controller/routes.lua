content_type("application/json")

get('/', function(params)
	routes = utils.get_model("routings")
	return routes
end)

get('/:id', function(params)
	routes = utils.get_model("routings", params.id)
	return routes
end)

post('/', function(params)
	print(serialize(params))

	ret = utils.create_model('routings', params.request)

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)

put('/:id', function(params)
	print(serialize(params))
	return params
end)

delete('/:id', function(params)
	print(serialize(params))

	ret = utils.delete_model("routings", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
