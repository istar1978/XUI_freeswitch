content_type("application/json")

get('/', function(params)
	routes = utils.get_model("routes")
	if (routes)	then
		return routes
	else
		return "[]"
	end
end)

get('/:id', function(params)
	route = utils.get_model("routes", params.id)
	if route then
		return route
	else
		return 404
	end
end)

post('/', function(params)
	print(serialize(params))

	ret = utils.create_model('routes', params.request)

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
	ret = utils.delete_model("routes", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
