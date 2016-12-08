content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/:id', function(params)
	local were = " where cid = " .. params.id
	n, tel = xdb.find_by_cond("tels", were)
	if (n > 0)	then
		return tel
	else
		return "[]"
	end
end)

function xdb.find_by_cond(t, cond, sort, cb)
	local cstr = _cond_string(cond)
	local sql = "SELECT * FROM " .. t

	if cstr then sql = sql .. cstr end
	if sort then sql = sql .. " ORDER BY " .. sort end

	return xdb.find_by_sql(sql, cb)
end
