local prefix = "/tmp/"

get('/:id', function(params)
	local xml_file = prefix .. params.id .. ".xml"
	file = io.open(xml_file, "r")
	local t = file:read("*all")
	file:close()

	-- content_type("text/xml")
	content_type("text/plain")
	return t
end)

post('/:id', function(params)
	print(serialize(params))
	print(env:serialize())

	local xml = env:getHeader("xml");
	local js_code = env:getHeader("js_code");
	local lua_code = env:getHeader("lua_code");

	local xml_file = prefix .. params.id .. ".xml"
	local js_file  = prefix .. params.id .. ".js"
	local lua_file = prefix .. params.id .. ".lua"

	freeswitch.consoleLog("ERR", xml);
	freeswitch.consoleLog("ERR", js_code);
	freeswitch.consoleLog("ERR", lua_code);

	file = io.open(xml_file, "w")
	file:write(xml, "\n")
	file:close()

	file = io.open(js_file, "w")
	file:write(js_code, "\n")
	file:close()

	file = io.open(lua_file, "w")
	file:write(lua_code, "\n")
	file:close()

	return "OK"
end)
