local prefix = "/tmp/"

get('/', function(params)
	blocks = utils.get_model("blocks")

	if (blocks) then
		return blocks
	else
		return "[]"
	end
end)

get('/:id', function(params)
	user = utils.get_model("blocks", params.id)
	if user then
		return user
	else
		return 404
	end
end)

get('/file/:id', function(params)
	local xml_file = prefix .. params.id .. ".xml"
	file = io.open(xml_file, "r")
	local t = file:read("*all")
	file:close()

	-- content_type("text/xml")
	content_type("text/plain")
	return t
end)

post('/', function(params)
	print(serialize(params))

	ret = utils.create_model('blocks', params.request)

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
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

delete('/:id', function(params)
	ret = utils.delete_model("blocks", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
