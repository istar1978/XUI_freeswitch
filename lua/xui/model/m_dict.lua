
m_dict = {}

m_dict.get_obj = function(realm)
	n, dicts = xdb.find_by_cond("dicts", {realm = realm})
	local obj = {}

	if (n > 0) then
		for key, val in pairs(dicts) do
			obj[val.k] = val.v
		end
	end
	return obj
end
