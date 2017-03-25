--[[
/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2013-2017, Seven Du <dujinfang@x-y-t.cn>
 *
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is XUI - GUI for FreeSWITCH
 *
 * The Initial Developer of the Original Code is
 * Seven Du <dujinfang@x-y-t.cn>
 * Portions created by the Initial Developer are Copyright (C)
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Seven Du <dujinfang@x-y-t.cn>
 *
 *
 */
]]

-- jxtra in Lua init script
-- Global vars from FreeSWITCH
-- env Table that has the request params, json in body
-- stream The output stream to write to, always use raw_write()
-- freeswitch The freeswitch object, e.g. you can use freeswitch.consoleLog()

local xtra_debug = true

if xtra_debug then

-- print(env:serialize())

end

local cur_dir = debug.getinfo(1).source;
cur_dir = string.gsub(debug.getinfo(1).source, "^@(.+/)[^/]+$", "%1")

package.path = package.path .. ";" .. cur_dir .. "?.lua"
package.path = package.path .. ";" .. cur_dir .. "jsonapi/?.lua"

require 'utils'
require 'xtra_config'
require 'xdb'

content_type = env:getHeader("Content-Type")

jxtra = {}
jxtra.matched = false
jxtra.write = function(j, s)
	stream:raw_write(s, string.len(s))
end
jxtra.params = {}

require 'xtra_config'

if config.db_auto_connect then xdb.connect(config.dsn) end

if (content_type == "application/json") then
	body = env:getBody()
	if body then
		if xtra_debug then
			-- print("body: " .. body:len() .. "\n" .. body .. "\n")
		end
		jxtra.params = (utils.json_decode(body))
	end
end

fun = function(name, func)
	if name == jxtra.params.func then
		ret = func(jxtra.params.data)

		if type(ret) == "table" then
			if ret.jstr then
				jxtra:write(ret.jstr)
			else
				jstra:write(utils.json_encode(ret))
			end
		end

		fun = function(n, p, f) end
		jxtra.matched = true
	end
end

if (jxtra.params.method) then -- todo sanity check?
	if (jxtra.params.func) then
		require(jxtra.params.method)
		if not jxtra.matched then
			jxtra:write('{"error": "No such func: ' .. params.func .. '"}')
		end
	else
		jxtra:write('{"error": "No func"}')
	end
else
	jxtra:write('{"error": "Method not found"')
end
