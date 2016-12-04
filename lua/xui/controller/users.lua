content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/', function(params)
	n, users = xdb.find_all("users")

	if (users) then
		return users
	else
		return "[]"
	end
end)

get('/:id', function(params)
	user = xdb.find("users", params.id)
	if user then
		return user
	else
		return 404
	end
end)

put('/:id', function(params)
	print(serialize(params))
	ret = xdb.update("users", params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)

post('/', function(params)
	print(serialize(params))

	ret = xdb.create('users', params.request)

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = xdb.delete("users", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
