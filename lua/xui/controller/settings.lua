content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/event_socket', function(params)
        n, events = xdb.find_by_cond('params', {realm = 'event_socket'})

        if (n > 0) then
                return events
        else
                return "[]"
        end
end)


put('/event_socket/:id', function(params)
	print(serialize(params))
	ret = nil;

	if params.request.action and params.request.action == "toggle" then
		sql = "UPDATE params SET disabled = NOT disabled" ..
			xdb.cond({realm = 'event_socket', id = params.id})
		print(sql)
		xdb.execute(sql)
		if xdb.affected_rows() == 1 then
			return xdb.find("params", params.id)
		end
	else
		xdb.update_by_cond("params", {realm = 'event_socket', id = params.id}, params.request)
		if xdb.affected_rows() == 1 then
			return xdb.find("params", params.id)
		end
	end

	if true then return 404 end
end)
