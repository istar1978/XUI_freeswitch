gw_name = params:getHeader("gateway")
profile_name = params:getHeader("profile")
globals = {}

-- freeswitch.consoleLog("ERR", "fetching gateway " .. gw_name .. "\n")

function get_globals()
	local api = freeswitch.API()
	local ret = api:execute("global_getvar")

	for line in ret:gmatch("[^\n]+") do
		local k, v = line:match("([^=]+)=([^=]*)")
		-- print("k: " .. k .. " v: " .. v)
		globals[k] = v
	end
end

function expand(s)
	e = s:gsub("%$%${[^}]+}", function(token)
		local k = token:sub(4, -2)
		-- freeswitch.consoleLog('INFO', token .. '\n')
		r = globals[k]
		if not r then
			r = token
		end
		return r
	end)
	return e
end

if gw_name then
	XML_STRING = [[<configuration name="sofia.conf" description="sofia Endpoint">
		<profiles><profile name="external"><gateways>]]

	xdb.find("gateways", {name = gw_name}, function(row)
		local p = '<param name="realm"' .. ' value="' .. row.realm .. '"/>'
		p = p .. '<param name="username"' .. ' value="' .. row.username .. '"/>'
		p = p .. '<param name="password"' .. ' value="' .. row.password .. '"/>'
		p = p .. '<param name="register"' .. ' value="' .. row.register .. '"/>'

		local gw = '<gateway name="' .. row.name .. '">' .. p .. '</gateway>'

		XML_STRING = XML_STRING .. gw
	end)

	XML_STRING = XML_STRING .. "</gateways></profile></profiles></configuration>"

elseif profile_name then
	local profile = nil

	xdb.find("sip_profiles", {name = profile_name}, function(row)
		profile = row
	end)

	if (profile) then
		get_globals()

		XML_STRING = [[<configuration name="sofia.conf" description="sofia Endpoint">
			<profiles><profile name="]] .. profile_name .. [["><settings>]]

		local settings = ""

		xdb.find("params", {realm = 'sip_profile', ref_id = profile.id, disabled = 'false'}, function(row)
			settings = settings .. '<param name="' .. row.k .. '" value="' .. expand(row.v) .. '"/>'
		end)

		XML_STRING = XML_STRING .. settings .. "</settings></profile></profiles></configuration>"
	end
end
