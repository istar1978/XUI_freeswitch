require 'xdb'
xdb.bind(xtra.dbh)

m_gateway = {}

function create(kvp)
	template = kvp.template
	kvp.template = nil

	id = xdb.create_return_id("gateways", kvp)
	freeswitch.consoleLog('err',id)
	-- print(id)
	if id then
		local realm = 'gateway'
		local ref_id = 0
		if not (template == "default") then
			realm = 'gateway' -- the table name
			ref_id = template
		end

		local sql = "INSERT INTO params (realm, k, v, ref_id, disabled) SELECT 'gateway', k, v, " ..
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
		local realm = 'gateway'
		local sql = "INSERT INTO params (id, realm, k, v, ref_id) values (" .. id .. ", '" .. realm .. "', '" .. kvp.k .. "' , '" .. kvp.v .. "', " .. ref_id .. ")"
		freeswitch.consoleLog('err', sql)
		xdb.execute(sql)
	end

	return id
end

function params(gw_id)
	rows = {}
	sql = "SELECT * from params WHERE realm = 'gateway' AND ref_id = " .. gw_id
	print(sql)
	xdb.find_by_sql(sql, function(row)
		table.insert(rows, row)
	end)
	-- print(serialize(rows))
	return rows
end

function toggle_param(gw_id, param_id)
	sql = "UPDATE params SET disabled = NOT disabled" ..
		xdb.cond({realm = 'gateway', ref_id = gw_id, id = param_id})
	print(sql)
	xdb.execute(sql)
	if xdb.affected_rows() == 1 then
		return xdb.find("params", param_id)
	end
	return nil
end

function update_param(gw_id, param_id, kvp)
	xdb.update_by_cond("params", {realm = 'gateway', ref_id = gw_id, id = param_id}, kvp)
	if xdb.affected_rows() == 1 then
		return xdb.find("params", param_id)
	end
	return nil;
end

m_gateway.delete = function(gw_id)
	xdb.delete("gateways", gw_id);
	local sql = "DELETE FROM params " .. xdb.cond({realm = 'gateway', ref_id = gw_id})
	xdb.execute(sql)
	return xdb.affected_rows()
end

m_gateway.create = create
m_gateway.params = params
m_gateway.toggle_param = toggle_param
m_gateway.update_param = update_param
m_gateway.createParam = createParam

return m_gateway
