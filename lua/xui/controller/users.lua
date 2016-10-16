content_type("application/json")

get('/', function(params)
	local users =  {
		users = {}
	}

	local sql = "SELECT id, data FROM users;"
	xtra.dbh:query(sql, function(row)
		local jdata = utils.json_decode(row.data)
		table.insert(users.users, {
			id = row.id,
			login = jdata.login,
			domain = jdata.domain,
			email = jdata.email,
			typ = jdata.typ,
			gender = jdata.gender,
			password = jdata.password,
			firstName = jdata.firstName,
			lastName = jdata.lastName,
			nickName = jdata.nickName,
			displayOrder = jdata.displayOrder,
			defaultNumber = jdata.defaultNumber,
			links = {
				extensions = '/api/extensions?userID=' .. row.id
			} 
		})
	end)
	return users
end)

get('/:id', function(params)
	local users =  {
		users = {}
	}

	local sql = "SELECT id, data FROM users WHERE id = " .. params.id;
	xtra.dbh:query(sql, function(row)
		local jdata = utils.json_decode(row.data)
		table.insert(users.users, {
			id = row.id,
			login = jdata.login,
			domain = jdata.domain,
			email = jdata.email,
			typ = jdata.typ,
			gender = jdata.gender,
			password = jdata.password,
			firstName = jdata.firstName,
			lastName = jdata.lastName,
			nickName = jdata.nickName,
			displayOrder = jdata.displayOrder,
			defaultNumber = jdata.defaultNumber,
			links = {
				extensions = '/api/extensions?userID=' .. row.id
			} 
		})
	end)
	return users
end)

put('/:id', function(params)
	print(utils.json_encode(params))
	local data = params.request.user

	local sql = "UPDATE users SET data = '" .. utils.json_encode(data) .. "' WHERE id = " .. params.id
	xtra.dbh:query(sql)
	if (xtra.dbh:affected_rows() == 1) then
		return data
	else
		return 500
	end
end)

post('/', function(params)
	local data = {}
	data = params.request.user

	local sql = "INSERT INTO users (data) VALUES ('" .. utils.json_encode(data) .. "');"
	xtra.dbh:query(sql)
	if (xtra.dbh:affected_rows() == 1) then
		local id
		xtra.dbh:query("SELECT last_insert_rowid() AS id", function(row)
			id = row.id
		end)
		return params.request
	else
		return 500
	end
end)

delete('/:id', function(params)
	local sql = "DELETE FROM users WHERE id = " .. params.id
	xtra.dbh:query(sql)
	if (xtra.dbh:affected_rows() == 1) then
		xtra.dbh:query("DELETE FROM extensions WHERE userID = " .. params.id)   -- DELTET ON CASCADE
		return 204
	else
		return 500
	end
end)