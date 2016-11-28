content_type("application/json")
require 'xdb'
xdb.dbh(xtra.dbh)

get('/', function(params)
	gateways = utils.get_model("gateways")

	if (gateways) then
		return gateways
	else
		return "[]"
	end
end)

get('/:id', function(params)
	user = utils.get_model("gateways", params.id)
	if user then
		return user
	else
		return 404
	end
end)

put('/:id', function(params)
	print(serialize(params))
	ret = xdb.update_model("gateways", params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)

post('/', function(params)
	print(serialize(params))

	ret = utils.create_model('gateways', params.request)

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = utils.delete_model("gateways", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
