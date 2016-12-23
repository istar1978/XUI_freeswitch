function build_modules_conf(modules)
	local settings = ""
	local cond = {realm = 'modules', disabled = 0}

	xdb.find_by_cond("params", cond, "id", function(row)
		settings = settings .. '<load module="' .. row.k ..'"/>'
	end)

	return [[<modules>]] .. settings .. [[</modules>]]
end

XML_STRING = [[<configuration name="post_load_modules.conf" description="Post Load Modules">]] ..
		build_modules_conf(modules) .. [[</configuration>]]
