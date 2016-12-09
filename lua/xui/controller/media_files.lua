content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/', function(params)
	n, mfiles = xdb.find_all("media_files")

	if (mfiles) then
		return mfiles
	else
		return "[]"
	end
end)

get('/:id', function(params)
	mfile = xdb.find("media_files", params.id)
	if mfile then
		return mfile
	else
		return 404
	end
end)

put('/:id', function(params)
	print(serialize(params))
	ret = xdb.update("media_files", params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)

post('/', function(params)
	print(serialize(params))

	mfile = xdb.create_return_id('media_files', params.request)

	if mfile then
		return {id = ret}
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = xdb.delete("media_files", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
