content_type("application/json")
-- require 'xdb'
-- xdb.bind(xtra.dbh)

get('/log', function(params)

	content_type("text/plain")

	local f = io.open(config.base_dir .. "/log/freeswitch.log", "rb")
    local content = f:read("*all")
    f:close()

	header("Content-Disposition", "attachment; filename=freeswitch.log.txt")
    return content
end)
