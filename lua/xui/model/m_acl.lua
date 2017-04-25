require 'xdb'
xdb.bind(xtra.dbh)

m_acl = {}

function create(kvp)
	template = kvp.template
	kvp.template = nil

	id = xdb.create_return_id("acls", kvp)
	freeswitch.consoleLog('err',id)
	-- print(id)
	if id then
		local realm = 'acl'
		local ref_id = 0
		if not (template == "default") then
			realm = 'acl' -- the table name
			ref_id = template
		end

		local sql = "INSERT INTO params (realm, k, v, ref_id, disabled) SELECT 'acl', k, v, " ..
			id .. ", disabled From params" ..
			xdb.cond({realm = realm, ref_id = ref_id})

		xdb.execute(sql)
	end
	return id
end

function createParam(kvp)
	id = xdb.create_return_id("acl_nodes", kvp)
	-- print(id)
	if id then
		local acl_id = kvp.acl_id
		local sql = "INSERT INTO acl_nodes (id, k, v, acl_id) values (" .. id .. ", '" .. kvp.k .. "' , '" .. kvp.v .. "', " .. acl_id .. ")"
		freeswitch.consoleLog('err',sql)
		xdb.execute(sql)
	end

	return id
end

function params(acl_id)
	rows = {}
	sql = "SELECT * from acl_nodes WHERE acl_id = " .. acl_id
	print(sql)
	xdb.find_by_sql(sql, function(row)
		table.insert(rows, row)
	end)
	-- print(serialize(rows))
	return rows
end

function toggle_param(rt_id, param_id)
	sql = "UPDATE acl_nodes SET " ..
		xdb.cond({acl_id = rt_id, id = param_id})
	print(sql)
	xdb.execute(sql)
	if xdb.affected_rows() == 1 then
		return xdb.find("acl_nodes", param_id)
	end
	return nil
end

function update_param(rt_id, param_id, kvp)
	xdb.update_by_cond("acl_nodes", {acl_id = rt_id, id = param_id}, kvp)
	if xdb.affected_rows() == 1 then
		return xdb.find("acl_nodes", param_id)
	end
	return nil;
end

m_acl.delete = function(rt_id)
	local sql = "DELETE FROM acl_nodes " .. xdb.cond({id = rt_id})
	xdb.execute(sql)
	return xdb.affected_rows()
end

m_acl.create = create
m_acl.params = params
m_acl.toggle_param = toggle_param
m_acl.update_param = update_param
m_acl.createParam = createParam

return m_acl
