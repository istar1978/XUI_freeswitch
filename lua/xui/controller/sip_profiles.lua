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

put('/:id/params/:param_id', function(params)
	print(serialize(params))
	ret = nil;

	if params.request.action and params.request.action == "toggle" then
		ret = m_sip_profile.toggle_param(params.id, params.param_id)
	else
		ret = m_sip_profile.update_param(params.id, params.param_id, params.request)
	end

	if ret then
		return ret
	else
		return 404
	end
end)

post('/', function(params)
	ret = m_sip_profile.create(params.request)

	if ret then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = m_sip_profile.delete(params.id)

	if ret >= 0 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
