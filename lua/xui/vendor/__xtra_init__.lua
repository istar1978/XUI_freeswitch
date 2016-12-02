-- xtra in Lua init script
-- The first script that the HTTP server hit

-- Global vars from FreeSWITCH
-- env Table that has the request params in http get query string or
--     post body in application/x-www-form-urlencoded format
-- stream The output stream to write to
-- freeswitch The freeswitch object, e.g. you can use freeswitch.consoleLog()

local xtra_debug = true

if xtra_debug then
	http_uri = env:getHeader("HTTP-URI")
	http_query = env:getHeader("HTTP-QUERY")
	freeswitch.consoleLog("INFO", "xtra.http_uri: " .. http_uri .. "\n")
	if (http_query) then
		freeswitch.consoleLog("INFO", "xtra.http_query: " .. http_query .. "\n")
	end
end

local cur_dir = debug.getinfo(1).source;
cur_dir = string.gsub(debug.getinfo(1).source, "^@(.+/)vendor/__xtra_init__.lua$", "%1")

package.path = package.path .. ";" .. cur_dir .. "?.lua"
package.path = package.path .. ";" .. cur_dir .. "vendor/?.lua"
package.path = package.path .. ";" .. cur_dir .. "controller/?.lua"
package.path = package.path .. ";" .. cur_dir .. "model/?.lua"
freeswitch.consoleLog("INFO", package.path);

require 'xtra_config'
require 'utils'
require 'xtra'

-- Now run the actuall controller
xtra.controller_path = string.gsub(xtra.controller_path, ".lua", "")
freeswitch.consoleLog("INFO", xtra.controller_path);

require(xtra.controller_path)

if not xtra.rest_matched then
	response_start(404)
	xtra.response('{"result": "error", "code": "404", "error_text": "That\'s all we know"}')
end
