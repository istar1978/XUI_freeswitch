content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/', function(params)
	n, gateways = xdb.find_all("gateways")

	if (n > 0) then
		return gateways
	else
		return "[]"
	end
end)

get('/:id', function(params)
	user = xdb.find("gateways", params.id)
	if user then
		return user
	else
		return 404
	end
end)

put('/:id', function(params)
	print(serialize(params))
	ret = xdb.update("gateways", params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)

post('/', function(params)
	print(serialize(params))

	ret = xdb.create_return_id('gateways', params.request)

	if ret then
		return {id = ret}
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = xdb.delete("gateways", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
