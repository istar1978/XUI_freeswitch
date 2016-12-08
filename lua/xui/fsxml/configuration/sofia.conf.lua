local gw_name = params:getHeader("gateway")
local profile_name = params:getHeader("profile")
local globals = {}

-- freeswitch.consoleLog("ERR", "fetching gateway " .. gw_name .. "\n")

function get_globals()
	local api = freeswitch.API()
	local ret = api:execute("global_getvar")

	for line in ret:gmatch("[^\n]+") do
		local k, v = line:match("([^=]+)=([^=]*)")
		-- print("================= k: " .. k .. " v: " .. v)
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

function build_gateways(cond)
	local gws = ""
	xdb.find_by_cond("gateways", cond, "id", function(row)
		local p = '<param name="realm"' .. ' value="' .. row.realm .. '"/>'
		p = p .. '<param name="username"' .. ' value="' .. row.username .. '"/>'
		p = p .. '<param name="password"' .. ' value="' .. row.password .. '"/>'
		p = p .. '<param name="register"' .. ' value="' .. row.register .. '"/>'

		local gw = '<gateway name="' .. row.name .. '">' .. p .. '</gateway>'

		gws = gws .. gw
	end)
	return gws
end

function build_profile(profile)
	local settings = ""
	local cond = {realm = 'sip_profile', disabled = 'false', ref_id = profile.id}
	local gateways = ""

	-- only works on external for now
	if profile.name == "external" then gateways = build_gateways() end

	xdb.find_by_cond("params", cond, 'id', function(row)
		settings = settings .. '<param name="' .. row.k .. '" value="' .. expand(row.v) .. '"/>'
	end)

	return [[<profile name="]] .. profile.name .. [["><gateways>]] ..
			gateways ..
			[[</gateways><settings>]] ..
			settings ..
			[[</settings></profile>]]
end

function build_profiles()
	local profiles = ""
	xdb.find_by_cond("sip_profiles", {disabled = 'false'}, 'id', function(row)
		profiles = profiles .. build_profile(row)
	end)

	return profiles
end

if gw_name then
	local gateways

	if gw_name == '_all_' then
		gateways = build_gateways()
	else
		gateways = build_gateways({name = gw_name})
	end

	XML_STRING = [[<configuration name="sofia.conf" description="sofia Endpoint">
		<profiles><profile name="external"><gateways>]] .. gateways ..
		"</gateways></profile></profiles></configuration>"

elseif profile_name then
	local profile = nil

	xdb.find_by_cond("sip_profiles", {name = profile_name}, 'id', function(row)
		profile = row
	end)

	if (profile) then
		get_globals() -- fetch global vars so we can expand them

		XML_STRING = [[<configuration name="sofia.conf" description="sofia Endpoint">
			<profiles>]] .. build_profile(profile) ..
			[[</profiles></configuration>]]
	end
else -- feed everything on module load
	get_globals() -- fetch global vars so we can expand them

	XML_STRING = [[<configuration name="sofia.conf" description="sofia Endpoint">
		<profiles>]] .. build_profiles() .. [[</profiles></configuration>]]
end
