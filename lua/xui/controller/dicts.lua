content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/', function(params)
	n, dicts = xdb.find_all("dicts")

	if (n > 0) then
		return dicts
	else
		return "[]"
	end
end)

get('/:id', function(params)
	dict = xdb.find("dicts", params.id)
	if dict then
		return dict
	else
		return 404
	end
end)

put('/:id', function(params)
	print(serialize(params))
	ret = xdb.update("dicts", params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)



post('/', function(params)
	print(serialize(params))

	ret = xdb.create_return_id('dicts', params.request)

	if ret then
		return {id = ret}
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = xdb.delete("dicts", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
