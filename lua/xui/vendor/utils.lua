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

-- TODO handle SQL injection

function create_model(table_name, obj)
	fields = {}
	values = {}

	for k, v in pairs(obj) do
		if (v and (not (v == ''))) then
			table.insert(fields, k)
			table.insert(values, v)
		end
	end
	sql = "INSERT into " .. table_name .. " (" .. strjoin(fields) .. ") VALUES (" .. strjoin(values, ",", true) .. ")"
	-- print(sql)

	xtra.dbh:query(sql)
	return xtra.dbh:affected_rows()
end

function get_model(table_name, id)
	t = {}
	found = false
	sql = "SELECT * FROM " .. table_name

	if id then sql = sql .. " WHERE id = " .. id end

	xtra.dbh:query(sql, function(row)
		found = true
		if id then
			t = row
		else
			table.insert(t, row)
		end
	end)
	if found then
		return t
	else
		return nil
	end
end

function delete_model(table_name, id)
	local sql = "DELETE FROM " .. table_name .. " WHERE id = " .. id
	xtra.dbh:query(sql)

	return xtra.dbh:affected_rows()
end

utils.create_model = create_model
utils.get_model = get_model
utils.delete_model = delete_model
