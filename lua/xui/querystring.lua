local querystring = {}
local string = require('string')
local find = string.find
local gsub = string.gsub
local char = string.char
local byte = string.byte
local format = string.format
local match = string.match
local gmatch = string.gmatch

function querystring.urldecode(str)
	str = gsub(str, '+', ' ')
	str = gsub(str, '%%(%x%x)', function(h)
		return char(tonumber(h, 16))
	end)
	str = gsub(str, '\r\n', '\n')
	return str
end

function querystring.urlencode(str)
	if str then
		str = gsub(str, '\n', '\r\n')
		str = gsub(str, '([^%w ])', function(c)
			return format('%%%02X', byte(c))
		end)
		str = gsub(str, ' ', '+')
	end
	return str
end

-- parse querystring into table. urldecode tokens
function querystring.parse(str, sep, eq)
	if not sep then sep = '&' end
	if not eq then eq = '=' end
	local vars = {}
	for pair in gmatch(tostring(str), '[^' .. sep .. ']+') do
		if not find(pair, eq) then
			vars[querystring.urldecode(pair)] = ''
		else
			local key, value = match(pair, '([^' .. eq .. ']*)' .. eq .. '(.*)')
			if key and key ~= 'action' and key ~= 'sessionid' and key ~= 'users' and key ~= 'conference_name' and
				key ~= 'moderator' then
				vars[querystring.urldecode(key)] = querystring.urldecode(value)
			end
		end
	end
	return vars
end
-- module
return querystring
