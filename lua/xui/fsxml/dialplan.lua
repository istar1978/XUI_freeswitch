local actions = ""
local dest = params:getHeader("Hunt-Destination-Number")
local context = params:getHeader("Hunt-Context")
local actions_table = {}
local sql = "SELECT * FROM routes WHERE SUBSTR(prefix, 1, 1) = '" .. dest:sub(1,1) .. "' ORDER BY length(prefix) DESC"
local found = false

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
		actions = actions .. '<action application="' .. v.app .. '" data="' .. v.data .. '"/>'
	end
end

xdb.find_by_sql(sql, function(row)
	found = true

	if row.dnc and not (row.dnc == '') then
		dest = utils.apply_dnc(dest, row.dnc)
		table.insert(actions_table, {app = "set", data = "dnc=" .. row.dnc})
		table.insert(actions_table, {app = "set", data = "dnc_number=" .. dest})
	end

	if row.sdnc and not (row.sdnc == '') then
		local cid_number = params:getHeader("Caller-Caller-ID-Number")
		local sdnc_number = utils.apply_dnc(cid_number, row.sdnc)
		table.insert(actions_table, {app = "set", data = "sdnc=" .. row.sdnc})
		table.insert(actions_table, {app = "set", data = "sdnc_number=" .. sdnc_number})
		table.insert(actions_table, {app = "set", data = "effective_caller_id_number=" .. sdnc_number})
	end

	if (row.dest_type == 'SYSTEM') then
		lines = csplit(row.body, "\n")
		for k, v in pairs(lines) do
			local t = csplit(v, ' ')
			local app = table.remove(t, 1)
			local data = table.concat(t, ' ')
			if app and (not (app == '')) then
				table.insert(actions_table, {app = app,  data = data})
			end
		end
	elseif (row.dest_type == 'LOCAL') then
		table.insert(actions_table, {app = "bridge", data = "user/" .. dest})
	elseif (row.dest_type == 'GATEWAY') then
		table.insert(actions_table, {app = "bridge", data = "sofia/gateway/" .. row.body .. "/" .. dest})
	elseif (row.dest_type == 'IP') then
		table.insert(actions_table, {app = "bridge", data = "sofia/internal/" .. dest .. "@" .. row.body})
	elseif (row.dest_type == 'IVRBLOCK') then
		local block_prefix = config.block_path .. "/blocks-"
		table.insert(actions_table, {app = "lua", block_prefix .. row.dest_uuid .. ".lua"})
	end
end)

if found then
	build_actions(actions_table)
	XML_STRING = [[<context name="default">
		<extension name="LUA Dialplan">
			<condition>]] .. actions .. [[</condition>
		</extension>
	</context>]]
end
