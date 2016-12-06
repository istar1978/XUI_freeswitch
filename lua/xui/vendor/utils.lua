utils = {}

function utils.isModuleAvailable(name)
	if package.loaded[name] then
		return true
	else
		for _, searcher in ipairs(package.searchers or package.loaders) do
			local loader = searcher(name)
			if type(loader) == 'function' then
				package.preload[name] = loader
				return true
			end
		end
		return false
	end
end

function init_json_func()
	if utils.isModuleAvailable("cjson") then
		local json = require("cjson")
		utils.json_encode = json.encode
		utils.json_decode = json.decode
	else
		local json = require("JSON")
		utils.json_encode = function(...) return json.encode(json, ...) end
		utils.json_decode = function(...) return json.decode(json, ...) end
	end
end

init_json_func()

function strjoin(list, delimiter, quote)
	d = ""
	string = ""

	if not delimiter then delimiter = "," end

	for k,v in pairs(list) do
		if quote then v = "'" .. v .. "'" end

		string = string .. d .. v
		d = delimiter
	end
	return string
end

-- Split text into a list consisting of the strings in text,
-- separated by strings matching delimiter (which may be a pattern).
-- example: strsplit(",%s*", "Anna, Bob, Charlie,Dolores")
function strsplit(delimiter, text)
  local list = {}
  local pos = 1
  if strfind("", delimiter, 1) then -- this would result in endless loops
    error("delimiter matches empty string!")
  end
  while 1 do
    local first, last = strfind(text, delimiter, pos)
    if first then -- found?
      tinsert(list, strsub(text, pos, first-1))
      pos = last+1
    else
      tinsert(list, strsub(text, pos))
      break
    end
  end
  return list
end

utils.apply_dnc = function(number, dnc)
	if not dnc then return end

	if dnc:sub(1,1) == '/' then -- regexp
		local api=freeswitch.API()
		return api:execute("regex", "m:/" .. number .. dnc)
	end

	if dnc:sub(1,1) == 'r' then
		local n = tonumber(dnc:sub(2,2))
		local r = dnc:sub(3)
		return r .. number:sub(n + 1)
	end

	if dnc:sub(1,1) == 'R' then
		local n = tonumber(dnc:sub(2,2))
		local r = dnc:sub(3)
		if number:len() < n then
			return r
		else
			return number:sub(1, number:len() - n) .. r
		end
	end

	dnc:gsub("([+-][^+-]+)", function(prefix)
		-- print(prefix)
		if prefix:sub(1,1) == '-' then
			local pos = 2
			local s, e = string.find(number, prefix)
			if (s == 1) then
				pos = pos + e
			end
			number = number:sub(pos)
		elseif prefix:sub(1,1) == '+' then
			number = prefix:sub(2) .. number
		end
	end)
	return number
end

return utils
