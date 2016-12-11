--[[
/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2016-2016, Seven Du <dujinfang@x-y-t.cn>
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

get('/', function(params)
	local tabs = {}
	local tab = {id= 1, name = 'name1'}

	table.insert(tabs, tab)

	tab = {id= 2, name = 'name2'}
	table.insert(tabs, tab)

	tab = {id= 3, name = 'name3'}
	table.insert(tabs, tab)

	return tabs
end)

get('/:id', function(params)
	local tab = {id= params.id, name = "name"}
	return tab
end)

post('/', function(params)
	print(serialize(params))

	return {id = 1}
end)

delete('/', function(params)

	return 200
end)
