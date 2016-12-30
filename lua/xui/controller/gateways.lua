--[[
/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2015-2016, Seven Du <dujinfang@x-y-t.cn>
 *
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is XUI - GUI for FreeSWITCH
 *
 * The Initial Developer of the Original Code is
 * Seven Du <dujinfang@x-y-t.cn>
 * Portions created by the Initial Developer are Copyright (C)
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Seven Du <dujinfang@x-y-t.cn>
 *
 *
 */
]]

content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)
require 'm_gateway'

get('/', function(params)
	n, gateways = xdb.find_all("gateways")

	if (n > 0) then
		return gateways
	else
		return "[]"
	end
end)

get('/:id', function(params)
	user = xdb.find("gateways", params.id)
	if user then
		p_params = m_gateway.params(params.id)
		user.params = p_params
		return user
	else
		return 404
	end
end)

put('/:id', function(params)
	print(serialize(params))
	ret = xdb.update("gateways", params.request)
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
                ret = m_gateway.toggle_param(params.id, params.param_id)
        else
                ret = m_gateway.update_param(params.id, params.param_id, params.request)
        end

        if ret then
                return ret
        else
                return 404
        end
end)

post('/', function(params)
	ret = m_gateway.create(params.request)

	if ret then
		return {id = ret}
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = xdb.delete("gateways", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
