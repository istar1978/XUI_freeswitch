require 'xdb'
xdb.bind(xtra.dbh)

function create(kvp)
	template = kvp.template
	kvp.template = nil

	id = xdb.create_return_id("sip_profiles", kvp)
	-- print(id)
	if id then
		local realm = 'SOFIA'
		local ref_id = 0
		if not template == "default" then
			realm = 'sip_profile' -- the table name
			ref_id = "(SELECT id FROM sip_profiles WHERE name = '" .. realm .. "')"
		end

		local sql = "INSERT INTO params (realm, k, v, ref_id, disabled) SELECT 'sip_profile', k, v, " ..
			id .. ", disabled From params WHERE realm = '" ..
			realm .. "' AND ref_id = " .. ref_id
		-- print(sql);
		xdb.execute(sql)
	end
	return id
end

function params(profile_id)
	rows = {}
	sql = "SELECT * from params WHERE realm = 'sip_profile' AND ref_id = " .. profile_id
	print(sql)
	xdb.find_by_sql(sql, function(row)
		table.insert(rows, row)
	end)
	-- print(serialize(rows))
	return rows
end

m_sip_profile = {}
m_sip_profile.create = create
m_sip_profile.params = params
