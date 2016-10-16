JSON = (loadfile "../lua/xui/JSON.lua")() -- one-time load of the routines
local cjson = require "cjson"

for i = 1, 100000, 1 do
	raw_json_text = '{ "what": "books", "count": 3 }'
--	local lua_value = JSON:decode(raw_json_text) -- decode example
	local lua_value = cjson.decode(raw_json_text)
--	print(lua_value.what)
end

