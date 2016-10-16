content_type("application/json")

get('/', function(params)
	local contexts =  {
		contexts = {}
	}

	local sql = "select id, name, data from contexts;"
	xtra.dbh:query(sql, function(row)
		local jdata = utils.json_decode(row.data)
		table.insert(contexts.contexts, {
			id = row.id,
			name = row.name,
			description = jdata.description,
			links = {
				routings = '/api/routings?name=' .. row.name
			} 
		})
	end)
	return contexts
end)

get('/:id', function(params)
	local contexts =  {
		contexts = {}
	}

	local sql = "SELECT id, name, data FROM contexts WHERE id = " .. params.id;
	xtra.dbh:query(sql, function(row)
		local jdata = utils.json_decode(row.data)
		table.insert(contexts.contexts, {
			id = row.id,
			name = row.name,
			description = jdata.description,
			links = {
				routings = '/api/routings?name=' .. row.name
			} 
		})
	end)
	return contexts
end)

post('/', function(params)
	print(serialize(params))
	local data = {}
	data.description = params.request.context.description

	local sql = "INSERT INTO contexts (name, data) VALUES ('" .. params.request.context.name .. "', '" .. cjson.encode(data) .. "');"
	xtra.dbh:query(sql)
	if (xtra.dbh:affected_rows() == 1) then
		local id
		xtra.dbh:query("SELECT last_insert_rowid() AS id", function(row)
			id = row.id
		end)
		return params.context
	else
		return 500
	end
end)

put('/:id', function(params)
	print(serialize(params))
	return params
end)

delete('/:id', function(params)
	local sql = "DELETE FROM contexts WHERE id = " .. params.id
	xtra.dbh:query(sql)
	if (xtra.dbh:affected_rows() == 1) then
		xtra.dbh:query("DELETE FROM routings WHERE contextID = " .. params.id)   -- DELTET ON CASCADE
		return {result = "ok", data = params.id}
	else
		return  {result = "error", reason = "error"}
	end
end)
