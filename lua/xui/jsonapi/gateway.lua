fun("add", function(params)
	p = utils.json_encode(params)
	print("p .. " .. p)

	local name = params.name
	params.name = nil

	local kvp = {name = name, data = utils.json_encode(params)}

	xdb.create("gateways", kvp)
end)

fun("set", function(params)
	p = utils.json_encode(params)
	print("p .. " .. p)
	local cond = {}
	local kvp = {}

	if (params.id) then
		cond.id = params.id
		params.id = nil
	else
		cond.name = params.name
		params.name = nil
	end

	if params.name then
		kvp.name = params.name
		params.name = nil
	end

	kvp.data = utils.json_encode(params)

	xdb.update("gateways", cond, kvp)
end)

fun("list", function(params)
	local data = ""
	xdb.find("gateways", {name = params.name}, function(row)
		data = row["data"]
		print("zzzzz " .. data)
	end)

	return {jstr = data}
end)
