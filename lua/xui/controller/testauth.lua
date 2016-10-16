xtra.start_session()

print(xtra.session.user_id)

require_login()



get("/", function()
	local tab = {a= 1, b= 2}
	return tab
end)

get("/1", function()
	local tab = {a= 1, b= 2}
	return tab
end)

get("/2", function()
	local tab = {a= 1, b= 2}
	return tab
end)
