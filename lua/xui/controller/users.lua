content_type("application/json")

get('/', function(params)
	users = utils.get_model("users")
	return users
end)

get('/:id', function(params)
	user = utils.get_model("users", params.id)
	return user
end)

put('/:id', function(params)
	return 500
end)

post('/', function(params)
	print(serialize(params))

	ret = utils.create_model('users', params.request)

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = utils.delete_model("routings", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
