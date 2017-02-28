sessid = event:getHeader("verto_sessid")
login  = event:getHeader("verto_login")

api = freeswitch.API()

api:execute("hash", "insert/xui/" .. sessid .. "/" .. login)

-- freeswitch.consoleLog("INFO", sessid .. "\n")