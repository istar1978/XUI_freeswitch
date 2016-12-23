function build_modules_conf(modules)
	local settings = ""
	local cond = {realm = 'modules',disabled = 0}

	xdb.find_by_cond("params",cond,"id",function(row)
		settings = settings .. '<load module="' .. row.k ..'"/>'
	return [[<modules>]] .. settings .. [[</modules>]]
end
local modules = nil
local cond = {realm = 'modules',disabled = 0}

xdb.find_by_cond("params",cond,"id",function(row))
modules = row
end)

if (modules) then

	XML_STRING = [[<configuration name="modules.conf" description="Modules">]] ..
		build_modules_conf(modules) .. [[</configuration>]]
end

