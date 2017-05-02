require 'xdb'
xdb.bind(xtra.dbh)

m_route = {}

function create(kvp)
	template = kvp.template
	kvp.template = nil

	id = xdb.create_return_id("routes", kvp)
	freeswitch.consoleLog('err',id)
	-- print(id)
	if id then
		local realm = 'route'
		local ref_id = 0
		if not (template == "default") then
			realm = 'route' -- the table name
			ref_id = template
		end

		local sql = "INSERT INTO params (realm, k, v, ref_id, disabled) SELECT 'route', k, v, " ..
			id .. ", disabled From params" ..
			xdb.cond({realm = realm, ref_id = ref_id})

		xdb.execute(sql)
	end
	return id
end

function createParam(kvp)
	id = xdb.create_return_id("params", kvp)
	-- print(id)
	if id then
		local ref_id = kvp.ref_id
		local realm = 'route'
		local sql = "INSERT INTO params (id, realm, k, v, ref_id) values (" .. id .. ", '" .. realm .. "', '" .. kvp.k .. "' , '" .. kvp.v .. "', " .. ref_id .. ")"
		freeswitch.consoleLog('err',sql)
		xdb.execute(sql)
	end

	return id
end

function params(rt_id)
	rows = {}
	sql = "SELECT * from params WHERE realm = 'route' AND ref_id = " .. rt_id
	print(sql)
	xdb.find_by_sql(sql, function(row)
		table.insert(rows, row)
	end)
	-- print(serialize(rows))
	return rows
end

function toggle_param(rt_id, param_id)
	sql = "UPDATE params SET disabled = NOT disabled" ..
		xdb.cond({realm = 'route', ref_id = rt_id, id = param_id})
	print(sql)
	xdb.execute(sql)
	if xdb.affected_rows() == 1 then
		return xdb.find("params", param_id)
	end
	return nil
end

function update_param(rt_id, param_id, kvp)
	xdb.update_by_cond("params", {realm = 'route', ref_id = rt_id, id = param_id}, kvp)
	if xdb.affected_rows() == 1 then
		return xdb.find("params", param_id)
	end
	return nil;
end

m_route.delete = function(rt_id)
	xdb.delete("routes", rt_id);
	local sql = "DELETE FROM params " .. xdb.cond({realm = 'route', ref_id = rt_id})
	xdb.execute(sql)
	return xdb.affected_rows()
end

function delete_param(id, param_id)
	local sql = "DELETE FROM params where id = " .. param_id .. " AND ref_id = " .. id
	xdb.execute(sql)
	return xdb.affected_rows()
end

m_route.create = create
m_route.params = params
m_route.toggle_param = toggle_param
m_route.update_param = update_param
m_route.createParam = createParam
m_route.delete_param = delete_param

return m_route
