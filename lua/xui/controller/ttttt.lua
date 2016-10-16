-- psudo code

get("/", function(params)
	return api("show channels as json")
end)

get("/:uuid", function(params)
	return api("uuid_dump " .. params.uuid .. " json")
end)

post("/", function(params)
	return api("originate user/" .. params.dest_number .. " ... ")
end)

put("/:uuid", function(prams)
	return api("uuid_media on/off ...")
end)

delete("/:uuid", function(params)
	api("uuid_kill " .. params.uuid)
	return "ok"
end)
