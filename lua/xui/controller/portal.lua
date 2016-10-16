xtra.start_session();

get("/", function()

	if not xtra.session.user_id then
		redirect("/rest/portal/login")
		return
	end

	args = {}
	return {"render", "index.html", args}
end)

get("/login", function()
	if xtra.session.user_id then
		redirect("/rest/portal/")
		return
	end

	args = {}

	if xtra.session.flash_message then
		local msg = xtra.session.flash_message
		xtra.save_session("flash_message", nil)
		args["flash"] = msg
	end

	return {"render", "login.html", args}
end)

get("/logout", function()
	xtra.flash("您已退出登录")
	xtra.save_session("user_id", nil)
	redirect("/rest/portal/login")
end)

post("/login", function(params)
	login = env:getHeader("login")
	pass = env:getHeader("pass")

	if (login == "7" and pass == "7") then
		xtra.save_session("user_id", login)
		redirect("/rest/portal/")
	else
		xtra.flash("密码错误")
		redirect("/rest/portal/login", y)
	end
end)
