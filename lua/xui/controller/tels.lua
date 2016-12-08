content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/:id', function(params)
	local cond = {cid = params.id}
	n, tel = xdb.find_by_cond("tels", cond, "id")
	if (n > 0)	then
		return tel
	else
		return "[]"
	end
end)

post('/', function(params)
	print(serialize(params))
	ret = xdb.create_return_object('tels', params.request)
	if ret then
		return ret
	else
		return 500, "{}"
	end
end)
