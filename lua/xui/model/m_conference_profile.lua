require 'xdb'
xdb.bind(xtra.dbh)

m_conference_profile = {}

function create(kvp)
	template = kvp.template
	kvp.template = nil
	id = xdb.create_return_id("conference_profiles", kvp)
	-- print(id)
	if id then
		local realm = 'conference'
		local ref_id = 0
		local sql = "INSERT INTO params (realm, k, v, ref_id, disabled) SELECT 'conference', k, v, " ..
			id .. ", disabled From params where realm = 'conference' and ref_id = 0"

		xdb.execute(sql)
	end
	return id
end

function params(profile_id)
	rows = {}
	sql = "SELECT * from params WHERE realm = 'conference' AND ref_id = " .. profile_id
	print(sql)
	xdb.find_by_sql(sql, function(row)
		table.insert(rows, row)
	end)
	-- print(serialize(rows))
	return rows
end

function toggle(profile_id)
	sql = "UPDATE sip_profiles SET disabled = NOT disabled" ..
		xdb.cond({id = profile_id})
	print(sql)

	xdb.execute(sql)
	if xdb.affected_rows() == 1 then
		return xdb.find("sip_profiles", profile_id)
	end
	return nil
end

function toggle_param(profile_id, param_id)
	sql = "UPDATE params SET disabled = NOT disabled" ..
		xdb.cond({realm = 'conference', ref_id = profile_id, id = param_id})
	print(sql)
	xdb.execute(sql)
	if xdb.affected_rows() == 1 then
		return xdb.find("params", param_id)
	end
	return nil
end

function update_param(profile_id, param_id, kvp)
	xdb.update_by_cond("params", {realm = 'conference', ref_id = profile_id, id = param_id}, kvp)
	if xdb.affected_rows() == 1 then
		return xdb.find("params", param_id)
	end
	return nil;
end

m_conference_profile.delete = function(profile_id)
	xdb.delete("conference_profiles", profile_id);
	if (xdb.affected_rows() == 1) then
		local sql = "DELETE FROM params WHERE " .. xdb.cond({realm = 'conference', ref_id = profile_id})
		xdb.execute(sql)
	end
	return xdb.affected_rows()
end

m_conference_profile.create = create
m_conference_profile.params = params
m_conference_profile.toggle = toggle
m_conference_profile.toggle_param = toggle_param
m_conference_profile.update_param = update_param

return m_conference_profile
