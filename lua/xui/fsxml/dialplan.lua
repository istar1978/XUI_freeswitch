actions = ""
dest = params:getHeader("Hunt-Destination-Number")
context = params:getHeader("Hunt-Context")
actions_table = {}
sql = "SELECT * FROM routes WHERE SUBSTR(prefix, 1, 1) = '" .. dest:sub(1,1) .. "' ORDER BY length(prefix) DESC"
found = false

if do_debug then print(sql) end

local function csplit(str, sep)
	local ret={}
	local n=1
	for w in str:gmatch("([^"..sep.."]*)") do
		ret[n]=ret[n] or w -- only set once (so the blank after a string is ignored)
		if w=="" then n=n+1 end -- step forwards on a blank but not a string
	end
	return ret
end

function build_actions(t)
	for k,v in pairs(t) do
		actions = actions .. '<action application="' .. v.app .. '" data="' .. v.args .. '"/>'
	end
end

xdb.find_by_sql(sql, function(row)
	found = true
	if (row.dest_type == 'SYSTEM') then
		lines = csplit(row.body, "\n")
		for k, v in pairs(lines) do
			local t = csplit(v, ' ')
			local app = table.remove(t, 1)
			local args = table.concat(t, ' ')
			if app and (not (app == '')) then
				table.insert(actions_table, {app = app,  args = args})
			end
		end
	elseif (row.dest_type == 'LOCAL') then
		table.insert(actions_table, {app = "bridge", args = "user/" .. dest})
	elseif (row.dest_type == 'GATEWAY') then
		table.insert(actions_table, {app = "bridge", args = "sofia/gateway/" .. row.body .. "/" .. dest})
	elseif (row.dest_type == 'IP') then
		table.insert(actions_table, {app = "bridge", args = "sofia/internal/" .. dest .. "@" .. row.body})
	elseif (row.dest_type == 'IVRBLOCK') then
		table.insert(actions_table, {app = "lua", args = "/tmp/blocks-" .. row.body .. ".lua"})
	end
end)

if found then
	build_actions(actions_table)
	XML_STRING = [[<context name="default">
		<extension name="LUA Dialplan">
			<condition>
				]] .. actions .. [[
			</condition>
		</extension>
	</context>]]
end
