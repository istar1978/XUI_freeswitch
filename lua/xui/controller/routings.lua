content_type("application/json")

get('/', function(params)
	local sql
	local routings =  {
		routings = {}
	}
	local contextName = env:getHeader("name")
	if contextName then
		sql = "SELECT rt.id, rt.contextID, rt.data FROM routings rt LEFT JOIN contexts AS ct ON rt.contextID = ct.id WHERE ct.name = '" .. contextName .. "';"
	else
		sql = "SELECT id, contextID, data FROM routings;"
	end
	xtra.dbh:query(sql, function(row)
		local jdata = utils.json_decode(row.data)
		table.insert(routings.routings, {
			id = row.id,
			name = jdata.name,
			description = jdata.description,
			prefix = jdata.prefix,
			minLen = jdata.minLen,
			maxLen = jdata.maxLen,
			destType = jdata.destType,
			dnc = jdata.dnc,
			sdnc = jdata.sdnc,
			body = jdata.body,
			links = {
				context = '/api/contexts/' .. row.contextID
			} 
		})
	end)

	return routings
end)

post('/', function(params)
	print(serialize(params))
	routing = params.request.routing
	context = routing.context

	if not context then return 500 end

	routing.context = nil

	print('----')
	print(serialize(routing))

	data = utils.json_encode(routing)

	sql = "INSERT INTO routings (contextID, data) VALUES ('" ..
			context .. "', '" .. data .. "');"

	xtra.dbh:query(sql)

	id = 0
	xtra.dbh:query("SELECT last_insert_rowid() AS id", function(row)
		id = row.id
	end)

	print("id = " .. id)


	routing.id = id

	params.request.routing = routing
	return params.request
end)

delete('/:id', function(params)
	local sql = "DELETE FROM routings WHERE id = " .. params.id .. ""
	xtra.dbh:query(sql)
	if (xtra.dbh:affected_rows() == 1) then
		return {result = "ok", data = params.id}
	else
		return  {result = "error", reason = "error"}
	end
end)