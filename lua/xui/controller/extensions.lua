content_type("application/json")

get('/', function(params)
	local extensions =  {
		extensions = {}
	}
	local userID = env:getHeader("userID")
	local sql
	if userID then
		sql = "SELECT id, userID, data FROM extensions WHERE userID = " .. userID
	else
		sql = "SELECT id, userID, data FROM extensions;"
	end
	xtra.dbh:query(sql, function(row)
		local jdata = utils.json_decode(row.data)
		table.insert(extensions.extensions, {
			id = row.id,
			name = jdata.name,
			domain = jdata.domain,
			description = jdata.description,
			typ = jdata.typ,
			password = jdata.password,
			priority = jdata.priority,
			displayOrder = jdata.displayOrder,
			nbr = jdata.nbr,
			links = {
				user = '/api/user/' .. row.userID
			} 
		})
	end)
	return extensions
end)

get('/:id', function(params)
	local extensions =  {
		extensions = {}
	}

	local sql = "SELECT id, userID, data FROM extensions WHERE id = " .. params.id
	xtra.dbh:query(sql, function(row)
		local jdata = utils.json_decode(row.data)
		table.insert(extensions.extensions, {
			id = row.id,
			name = jdata.name,
			domain = jdata.domain,
			description = jdata.description,
			typ = jdata.typ,
			password = jdata.password,
			priority = jdata.priority,
			displayOrder = jdata.displayOrder,
			nbr = jdata.nbr,
			links = {
				user = '/api/users/' .. row.userID
			} 
		})
	end)
	return extensions
end)

post('/', function(params)
	print(serialize(params))
	extension = params.request.extension
	userID = extension.user

	if not userID then return 500 end

	extension.userID = nil

	local JSON = require("JSON")
	data = JSON:encode(extension)

	sql = "INSERT INTO extensions (userID, data) VALUES ('" ..
			userID .. "', '" .. data .. "');"

	xtra.dbh:query(sql)

	id = 0
	xtra.dbh:query("SELECT last_insert_rowid() AS id", function(row)
		id = row.id
	end)

	extension.id = id

	params.request.extension = extension
	return params.request
end)

put('/:id', function(params)
	print(cjson.encode(params))
	local data = params.request.extension

	local sql = "UPDATE extensions SET data = '" .. cjson.encode(data) .. "' WHERE id = " .. params.id
	xtra.dbh:query(sql)
	if (xtra.dbh:affected_rows() == 1) then
		return data
	else
		return 500
	end
end)

delete('/:id', function(params)
	local sql = "DELETE FROM extensions WHERE id = " .. params.id
	xtra.dbh:query(sql)
	if (xtra.dbh:affected_rows() == 1) then
		return 204
	else
		return 500
	end
end)
