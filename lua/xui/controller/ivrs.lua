--[[
/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2015-2017, Seven Du <dujinfang@x-y-t.cn>
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

get('/', function(params)

		n, ivr_menus = xdb.find_all("ivr_menus")

		if n > 0 then
			return ivr_menus
		else
			return "[]"
		end
end)

get('/:id', function(params)
	ivr = xdb.find("ivr_menus", params.id)
	if ivr then
		return ivr
	else
		return 404
	end
end)

get('/:id/actions', function(params)
	n, ivr_actions = xdb.find_by_cond("ivr_actions", { ivr_menu_id = params.id })
	if n > 0 then
		return ivr_actions
	else
		return '[]'
	end
end)

get('/:id/actions/:actions_id', function(params)
	n, ivr_actions = xdb.find_by_cond("ivr_actions", { ivr_menu_id = params.id ,id = params.actions_id})
	if ivr_actions then
		return ivr_actions
	else
		return 404
	end
end)



put('/:id', function(params)
	print(serialize(params))
	ret = xdb.update("ivr_menus", params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)

put('/:id/actions/:actions_id', function(params)
	print(serialize(params))
	action = params.request
	actions.ivr_menu_id = nil
	actions.id = nil
	ret = xdb.update_by_cond("ivr_actions", { ivr_menu_id = params.id, id = params.actions_id}, params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)

post('/', function(params)
	print(serialize(params))
	ret = xdb.create_return_id('ivr_menus', params.request)
	if ret then
		return {id = ret}
	else
		return 500, "{}"
	end
end)

post('/:id/actions', function(params)
	print(serialize(params))
	action = params.request
	action.ivr_menu_id = params.id
	action.digits = params.request.digits
	ret = xdb.create('ivr_actions', action)
	if  ret then
		return {id = ret}
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = xdb.delete("ivr_menus", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)

delete('/:id/actions/:actions_id', function(params)
	ret = xdb.delete("ivr_actions",{ ivr_menu_id = params.id, id = params.actions_id});

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)

