content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/', function(params)
	local check = xdb.checkPermission('4','file_get','get','/')
	if check then
		return '{"a":"b"}'
	else
		return '{"c":"d"}'
	end
	
end)

post('/', function(params)
	local check = xdb.checkPermission('4','file_get','post','/')
	if check then
		return '{"a":"b"}'
	else
		return '{"c":"d"}'
	end
	
end)
