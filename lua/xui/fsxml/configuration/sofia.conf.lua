gw_name = params:getHeader("gateway_name")

if gw_name then
	XML_STRING = '<profiles><profile name="external"><gateways>'

	xdb.find("gateways", {name = gw_name}, function(row)
		name = row["name"]
		data = row["data"]
		-- print("data: " .. data)

		tdata = utils.json_decode(data)
		local p = ""

		for k,v in pairs(tdata) do
			p = p .. '<param name="' .. k .. '"' .. ' value="' .. v .. '"/>'
		end

		local gw = '<gateway name="' .. name .. '">' .. p .. '</gateway>'

		XML_STRING = XML_STRING .. gw
	end)

	XML_STRING = XML_STRING .. "</gateways></profile></profiles>"
end
