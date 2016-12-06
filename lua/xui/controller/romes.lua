content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/', function(params)
	n, conferent = xdb.find_all("conferent")
	if (n > 0)	then
		return conferent
	else
		return "[]"
	end
end)

get('/:id', function(params)
	route = xdb.find("conferent", params.id)
	if route then
		return route
	else
		return 404
	end
end)

post('/', function(params)
	print(serialize(params))

	ret = xdb.create_return_object('conferent', params.request)

	if ret then
		return ret
	else
		return 500, "{}"
	end
end)

put('/:id', function(params)
	print(serialize(params))
	return params
end)

delete('/:id', function(params)
	ret = xdb.delete("conferent", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
