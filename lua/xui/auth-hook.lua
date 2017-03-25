--[[
	<hook event="CUSTOM" subclass="verto::login" script="/usr/local/freeswitch/xui/lua/xui/auth-hook.lua"/>
]]

freeswitch.consoleLog("INFO", event:serialize() .. "\n")


sessid = event:getHeader("verto_sessid")
login  = event:getHeader("verto_login")
success= event:getHeader("verto_success")

if (login and success == "1") then
	api = freeswitch.API()
	api:execute("hash", "insert/xui/" .. sessid .. "/" .. login)
end

freeswitch.consoleLog("INFO", sessid .. " Logged in\n")
