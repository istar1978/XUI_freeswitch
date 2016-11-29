gw_name = params:getHeader("gateway")

-- freeswitch.consoleLog("ERR", "fetching gateway " .. gw_name .. "\n")

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
end
