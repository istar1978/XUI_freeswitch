fun = {}

fun.conf_table = "switch_conferences"
fun.conf_member_table = "switch_conference_members"
fun.conf_file_table = "switch_conference_files"
fun.qx_member_table = "qxgroup_member"
fun.recording_file_table = "switch_recording_file"
fun.dict_table = "switch_dicts"
fun.qxgroup_member_table = "qxgroup_member"
fun.conf_select_columns = "id, topic, moderator_id, media_type, media_type, group_id, name, password, auto_started, switch_domain, switch_address, switch_port, description, typ, capacity, recording, profile, mode, TIMESTAMPDIFF(MINUTE, remind_time, started_at) as remind_time, created_at, started_at, stopped_at, updated_at, synced_at, deleted_at, completed_at"

require "config"

function fun.connect_db(dsn, user, pass)
	dsn = dsn or config.dsn
	user = user or config.db_user
	pass = pass or config.db_pass

	local dbh = freeswitch.Dbh("odbc://" .. dsn .. ":" .. user .. ":" .. pass)
	assert(dbh:connected())
	return dbh
end

function fun.bgapi_conf(commandstring)
	return api:executeString("bgapi conference " .. commandstring)
end

local function get_insert_string(httpquery)
	do
		local lutab = parse(httpquery)
		local keystring = ""
		local valuesting = ""
		local comma = ""
		for key, value in pairs(lutab) do
			keystring =  keystring .. comma .. key
			valuesting = valuesting .. comma .. "'" .. value .. "'"
			comma = ","
		end
		return keystring,valuesting
	end
end

local function get_update_string(httpquery)
	do
		local lutab = parse(httpquery)
		local string = ""
		local comma = ""
		for key, value in pairs(lutab) do
			if key == 'remind_time' and value == 'nil' then
				string = string .. comma .. key .. "=NULL"
				comma = ","
			else
				string = string .. comma .. key .. "='" .. value .. "'"
				comma = ","
			end
		end
		return string
	end
end

local function get_delete_string(httpquery)
	do
		local lutab = parse(httpquery)
		local string = ""
		local union_str = ""
		for key, value in pairs(lutab) do
			string = string .. union_str .. key .. "='" .. value .. "'"
			union_str = " and "
		end
		return string
	end
end

function fun.create(table, httpquery)
	if table == "switch_conferences" then
		httpquery = httpquery .. "&switch_domain=" .. config.switch_domain .. "&switch_address=" .. config.switch_domain .. "&switch_port=" .. config.switch_port
	end
	local keystring, valuesting = get_insert_string(httpquery)
	sql = "INSERT INTO " .. table .. "(" .. keystring .. ") VALUES(" .. valuesting .. ")"
	dbh:query(sql)
	return dbh:affected_rows()
end

function fun.create_return_id(table, httpquery)
	local keystring, valuesting = get_insert_string(httpquery)
	sql = "INSERT INTO " .. table .. "(" .. keystring .. ") VALUES(" .. valuesting .. ")"
	dbh:query(sql)
	if dbh:affected_rows() == 1 then
		dbh:query("SELECT LAST_INSERT_ID() as id", function(row)
			local tab = {}
			tab["result"] = "ok"
			tab["code"] = "200"
			subtab = {["id"] = row.id}
			tab["data"] = subtab
		end)
		return tab
	else
		return({"json", "error", 500, "create failure"})
	end
end

function fun.update(table, id, httpquery)
	local string = get_update_string(httpquery)
	sql = "UPDATE " .. table .. " SET " .. string .. " WHERE id = " .. id
	dbh:query(sql)
	return dbh:affected_rows()
end

function fun.delete(table, httpquery)
	local string = get_delete_string(httpquery);
	sql = "DELETE FROM " .. table .. " WHERE " .. string
	dbh:query(sql)
	return dbh:affected_rows()
end

function fun.delete_by_id(table, id)
	sql = "DELETE FROM " .. table .. " WHERE id = '" .. id .. "'"
	dbh:query(sql)
	return dbh:affected_rows()
end

function fun.api(commandstring)
	local api = freeswitch.API();
	return api:executeString(commandstring)
end

function fun.execute_redis_command(commandstring)
	return api:executeString("redis " .. commandstring)
end

function fun.uc_conf_hangup(conference_name, ...)
	local arg = {...}
	local cause = ""
	if not arg[1] then
		return "-ERR, user is empty"
	else
		if not arg[2] then
			cause = "CALL_REJECTED"
		else
			cause = arg[2]
		end
		local user_id = string.gsub(arg[1], "user%-", "")
		local event = freeswitch.Event("custom", "conference::maintenance")
		event:addHeader("action", "failed-call-member")
		event:addHeader("conference-name", conference_name)
		event:addHeader("uc_user_id", user_id)
		event:addHeader("cause", cause)
		event:fire()
		return "+OK"
	end
end

function fun.conf_remind(conference_id, event_type, str)
	local conf_table = fun.conf_table
	local conf_file_table = fun.conf_file_table
	local sql = "SELECT sc.*, COALESCE(TIMESTAMPDIFF(MINUTE, sc.remind_time, sc.started_at), 0) as remind_time_s, count(*) as count, scf.file_id " .. " FROM " .. conf_table .. " sc LEFT JOIN " .. conf_file_table .. " scf ON id = scf.conference_id WHERE id = '" .. conference_id .. "'" .. " AND typ = 'reserved'"
	local tab = {}
	dbh:query(sql, function(row)
		if row.count == "1" then
			local event = freeswitch.Event("custom", "UC::conference_remind")
			if event_type == "UPDATE" and str then
				event:addHeader("update_str", str)
			end

			if row.group_id then
				event:addHeader("group_id", row.group_id)
			end
			event:addHeader("event_type", event_type)
			event:addHeader("moderator_id", row.moderator_id)
			event:addHeader("topic", row.topic)
			event:addHeader("conference_mode", row.mode)
			event:addHeader("conference_name", row.name)
			event:addHeader("conference_id", row.id)
			event:addHeader("media_type", row.media_type)
			event:addHeader("remind_time", row.remind_time_s)
			event:addHeader("files", row.file_id)
			event:addHeader("started_at", row.started_at)
			event:addHeader("stopped_at", row.stopped_at)
			event:addHeader("description", row.description)
			event:fire()
			tab["result"] = "ok"
			tab["code"] = "200"
			tab["data"] = {["conference_id"] = conference_id}
		else
			tab = {"json", "error", "500", "conference is not exist"}
		end
	end);
	return tab
end

function fun.uc_conf_apply_speak(conference_name, ...)
	local arg = {...}
	if not arg[1] then
		return "-ERR, user is empty"
	else
		local user_id = string.gsub(arg[1], "user%-", "")
		local event = freeswitch.Event("custom", "conference::maintenance")
		event:addHeader("action", "apply-speak")
		event:addHeader("conference-name", conference_name)
		event:addHeader("uc_user_id", user_id)
		event:fire()
		return "+OK"
	end
end

function fun.uc_conf_cancel(conference_name, ...)
	local arg = {...}
	local conf_table = fun.conf_table
	local sql = "select * from " .. conf_table .. " WHERE name = '" .. conference_name .. "' LIMIT 1"
	local reply = ""
	dbh:query(sql, function(row)
		if not arg[1] then
			reply = "-ERR, cancel_users is empty"
		else
			local users = string.gsub(arg[1], "user%-", "")
			for user in string.gmatch(users, '([^,]+)') do
				local event = freeswitch.Event("clone", "UC::conference_cancel")
				event:addHeader("moderator_id", row.moderator_id)
				event:addHeader("media_type", row.media_type)
				event:addHeader("conference_name", conference_name)
				event:addHeader("uc_user_id", user)
				event:fire()
				reply = "+OK"
			end
		end
	end)
	return reply
end

function fun.uc_conf_create_or_invite(conference_name, action, ...)
	local arg = {...}
	local reply = ""
	local count = 0
	if action == "create" or action == "invite" then
		local conf_table = fun.conf_table
		local sql = "select * from " .. conf_table .. " WHERE name = '" .. conference_name .. "' LIMIT 1"
		dbh:query(sql, function(row)
			if not arg[1] then
				reply = "-ERR, users is empty"
			elseif row.capacity == "0" and row.typ ~= "ptt" then
				reply = "-ERR, capacity is 0"
			else
				local cjson = require "cjson"
				local conf_type = row.typ
				local users = string.gsub(arg[1], "user%-", "")
				local jUser = {}
				local jPresence = {}
				local media_type = row.media_type
				for user in string.gmatch(users, '([^,]+)') do
					local absolute_codec_string = ""
					if arg[2] == "audio" then
						absolute_codec_string = string.gsub(config.audio_codec, ",", "\\,")
					elseif arg[2] == "video" then
						absolute_codec_string = string.gsub(config.video_codec, ",", "\\,")
					end
					local presencereply = fun.execute_redis_command("hget presence " .. user)
					local userreply = fun.execute_redis_command("hget user " .. user)
					if not string.find(presencereply, "ERR NIL") then
						jPresence = cjson.decode(presencereply)
					end
					if not string.find(userreply, "ERR NIL") then
						jUser = cjson.decode(userreply)
					end
					if string.find(presencereply, "ERR NIL") or not jPresence.presence or jPresence.presence <= 0 then -- user is not online
						if count == 0 and action == "create" then
							reply = "-ERR moderator is not available"
							return
						else
							local mobilePhone = nil
							if string.find(userreply, "ERR NIL") then
								goto continue
							elseif not jUser.mobilePhone then
								goto continue
							else
								mobilePhone = jUser.mobilePhone
							end
							if conf_type == "instant" or conf_type == "reserved" or conf_type == "group" then
								fun.bgapi_conf(conference_name .. " dial {uc_user_id=" .. user .. ",uc_conference_name=" .. conference_name .. ",absolute_codec_string=".. absolute_codec_string .. "}sofia/gateway/gw/" .. mobilePhone)
							elseif conf_type == "ptt" then
								fun.bgapi_conf(conference_name .. " +flags{mute} dial {uc_user_id=" .. user .. ",uc_conference_name=" .. conference_name .. ",absolute_codec_string=".. absolute_codec_string .. "}sofia/gateway/gw/" .. mobilePhone)
							end
						end
						:: continue ::
					else
						local caller_id_name = nil
						if jUser then
							caller_id_name = jUser.userName
							local telephone_number = jUser.officePhone
							if count == 0 and action == "create" then -- moderator
								if conf_type == "instant" or conf_type == "reserved" then
									sinatra.log("info", "moderator create, do not send to officePhone\n")
								elseif conf_type == "group" then
									if telephone_number then
										fun.bgapi_conf(conference_name .. "+flags{moderator} dial {uc_one_number=true,uc_user_id=" .. user .. ",uc_conference_name=" .. conference_name .. ",absolute_codec_string=".. absolute_codec_string .. "}sofia/gateway/gw/" .. telephone_number)
									end
								end
							else
								if telephone_number then
									if conf_type == "ptt" then
										fun.bgapi_conf(conference_name .. "+flags{mute} dial {uc_one_number=true,uc_user_id=" .. user .. ",uc_conference_name=" .. conference_name .. ",absolute_codec_string=".. absolute_codec_string .. "}sofia/gateway/gw/" .. telephone_number)
									else
										fun.bgapi_conf(conference_name .. " dial {uc_one_number=true,uc_user_id=" .. user .. ",uc_conference_name=" .. conference_name .. ",absolute_codec_string=".. absolute_codec_string .. "}sofia/gateway/gw/" .. telephone_number)
									end
								end
							end
						end
						if not caller_id_name then
							caller_id_name = "UNKNOWN"
						end
						local new_conf_name = ""
						if conf_type == "instant" or conf_type == "reserved" then
							if count == 0 and action == "create" then
								if media_type == "audio" then
									new_conf_name = "CONF-" .. conference_name
								elseif media_type == "video" then
									new_conf_name = "VCONF-" .. conference_name
								end
							else
								if media_type == "audio" then
									new_conf_name = "conf-" .. conference_name
								elseif media_type == "video" then
									new_conf_name = "vconf-" .. conference_name
								end
							end
						elseif conf_type == "group" then
							new_conf_name = "group-" .. conference_name
						elseif conf_type == "ptt" then
							ptt_type = row.ptt_type
							new_conf_name = "ptt-" .. conference_name
						end
						local event = freeswitch.Event("custom", "UC::conference_call")
						if row.group_id then
							event:addHeader("group_id", row.group_id)
						end
						if ptt_type then
							event:addHeader("ptt_type", tostring(ptt_type))
						end
						event:addHeader("callee_id_name", caller_id_name)
						event:addHeader("callee_id_number", user)
						event:addHeader("destination_number", user)
						event:addHeader("moderator_id", row.moderator_id)
						event:addHeader("conference_type", row.typ);
						event:addHeader("conference_mode", row.mode);
						event:addHeader("conference-name", new_conf_name)
						event:addHeader("topic", row.topic)
						event:addHeader("conference_id", row.id)
						event:addHeader("started_at", row.started_at)
						event:addHeader("stopped_at", row.stopped_at)
						event:addHeader("switch_domain", row.switch_domain)
						event:addHeader("switch_address", row.switch_domain)
						event:addHeader("switch_port", row.switch_port)
						event:addHeader("media_type", media_type)
						event:fire()
					end
					count = count + 1
				end
				if count == 0 then
					reply = "ERR"
				else
					reply = "+OK"
				end
			end
		end)
	end
	return reply
end
