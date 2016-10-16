content_type("application/json")

function build_dial_params(var, val)
	if not val then return "" end
	if var == "ignore_early_media" and val == "true" then
		return ""
	elseif var == "callback_url" then
		return "{x_httpd_callback_url='" .. val .. "'," ..
			"session_in_hangup_hook=true," ..
			"api_hangup_hook='lua do_callback.lua'}"
	else
		val = "true"
	end

	return "{" .. var .. "=" .. "'" .. val .. "'}"
end

function build_dialstr(destNumber)
	return "user/" .. destNumber
end

function build_application(params)
	appstr = " "
	if params.app then
		appstr = appstr .. params.app

		if params.args then
			if params.app == "speak" then
				params.args = "tts_commandline|alex|" .. params.args
			end
			appstr = appstr .. ":'" .. params.args .. "'"
		end
	elseif params.apps then
		print(serialize(params.apps))
		comma = ""
		for i, v in pairs(params.apps) do
			if v.app == "speak" then
				v.args = "tts_commandline|alex|" .. v.args
			elseif v.app == "say_number" then
				v.app = "say"
				v.args = "en NUMBER ITERATED " .. v.args
			end

			appstr = appstr .. comma .. v.app .. ":'" .. v.args .. "'"
			comma = ","
		end
	else
		appstr = appstr .. "park"
	end

	appstr = appstr .. " inline"
	print(appstr)

	return appstr
end

function execute(cmd, args)
	api = freeswitch.API()
	ret = api:execute(cmd, args)
	if ret:match("^%+OK") then
		result = {result = "ok", uuid = ret:sub(5):sub(1, -2)}
	else
		result = {result = "error", reason = ret:sub(5):sub(1, -2)}
	end

	return result
end

post("/", function(params)
	if next(params) == nil then
		-- try to get params from env, which is from the query string body
		request = {}
		request.destNumber = env:getHeader("destNumber")
		request.cidName = env:getHeader("cidName")
		request.cidNumber = env:getHeader("cidNumber")
		request.earlyMedia = env:getHeader("earlyMedia")
		request.app = env:getHeader("app")
		request.args = env:getHeader("args")
		request.async = env:getHeader("async")
	else
		request = params.request
	end

	-- print(serialize(params))

	dialstr = build_dial_params("origination_caller_id_name", request.cidName) ..
		build_dial_params("origination_caller_id_number", request.cidNumber) ..
		build_dial_params("ignore_early_media", request.earlyMedia) ..
		build_dial_params("sip_auto_answer", request.autoAnswer) ..
		build_dialstr(request.destNumber) ..
		build_application(request)

	print(dialstr)
	api = freeswitch.API()

	if request.async == "true" then
		ret = api:execute("bgapi", "originate " .. dialstr)
		result = {result = "ok", jobUUID = ret:sub(15):sub(1, -2)}
	else
		ret = api:execute("originate", dialstr)
		if ret:match("^%+OK") then
			result = {result = "ok", uuid = ret:sub(5):sub(1, -2)}
		else
			result = {result = "error", reason = ret:sub(5):sub(1, -2)}
		end
	end

	return result
end)

delete("/:channel_uuid", function(params)
	cmd = "uuid_kill"
	args = params.channel_uuid

	print(serialize(params))
	print(args)

	if (params.request and params.request.hangupCause) then
		args = args .. " " .. params.request.hangupCause
	end
	return execute(cmd, args)
end)

put("/:channel_uuid/:action", function(params)
	print(params.request.action)
	return ""
end)

get("/", function(params)
	cmd = "show"
	args = "channels as json"

	api = freeswitch.API()
	ret = api:execute(cmd, args)

	if env:getHeader("native") == "true" then
	else
		-- remove leading {"row_count":2,"rows": and ending } from result
		start,stop = ret:find('{"row_count": 0}')
		if start then
			return "[]"
		else
			start,stop = ret:find(',"rows":')
			ret = ret:sub(stop+1, -2)
		end
	end

	return ret
end)

get("/:channel_uuid", function(params)
	cmd = "uuid_dump"
	args = params.request.channel_uuid .. " json"

	api = freeswitch.API()
	ret = api:execute(cmd, args)

	if ret:match("^%-") then
		return 404
	else
		return ret
	end
end)

--[[

curl -0 seven.local:8081/api/channels
curl -0 seven.local:8081/api/channels | python -m json.tool

curl -0 -XPOST -d "destNumber=1001&app=endless_playback&args=/wav/vacation.wav" seven.local:8081/api/channels

curl -0 -XDELETE seven.local:8081/api/channels/

]]