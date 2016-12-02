content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)
require 'm_sip_profile'

get('/', function(params)
	sip_profiles = utils.get_model("sip_profiles")

	if (sip_profiles) then
		return sip_profiles
	else
		return "[]"
	end
end)

get('/:id', function(params)
	profile = utils.get_model("sip_profiles", params.id)
	if profile then
		p_params = m_sip_profile.params(params.id)
		profile.params = p_params
		return profile
	else
		return 404
	end
end)

put('/:id', function(params)
	print(serialize(params))
	ret = xdb.update_model("sip_profiles", params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)

post('/', function(params)
	ret = m_sip_profile.create(params.request)

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = utils.delete_model("sip_profiles", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
