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

function build_group_options_tree(groups, options_tab)
	if (next(groups) ~= nil) then
		for k, v in pairs(groups) do
			if type(v) == "table" then
				local spaces = ""
				child_groups = {}
				option_tab = {}

				if (tonumber(v.level) ~= 0 ) then
					spaces = string.rep("  ", tonumber(v.level) *2) .. "|" .. "---"
				end

				option_tab["name"] = spaces .. v.name
				option_tab["value"] = v.id

				table.insert(options_tab, option_tab)
				n, child_groups = xdb.find_by_cond("groups", {group_id = v.id})
				build_group_options_tree(child_groups, options_tab)
			end
		end
	end
end

function build_group_options_tree_t(groups, options_tab, id)
	if (next(groups) ~= nil) then
		for k, v in pairs(groups) do
			if type(v) == "table" then
				local spaces = ""
				child_groups = {}
				option_tab = {}

				if (tonumber(v.level) ~= 0 ) then
					spaces = string.rep("  ", tonumber(v.level) *2) .. "|" .. "---"
				end

				option_tab["name"] = spaces .. v.name
				option_tab["value"] = v.id

				table.insert(options_tab, option_tab)
				n, child_groups = xdb.find_by_cond("groups", "group_id = " .. v.id .. " AND id <> " .. id)
				build_group_options_tree_t(child_groups, options_tab, id)
			end
		end
	end
end

function build_group_tree(groups, groups_tab)
	if (next(groups) ~= nil) then
		for k, v in pairs(groups) do
			if type(v) == "table" then
				local spaces = ""
				child_groups = {}

				if (tonumber(v.level) ~= 0 ) then
					spaces = string.rep("  ", tonumber(v.level) *2) .. "|" .. "---"
				end

				v["spaces"] = spaces

				table.insert(groups_tab, v)
				n, child_groups = xdb.find_by_cond("groups", {group_id = v.id})
				build_group_tree(child_groups, groups_tab)
			end
		end
	end
end

get('/', function(params)
	n, groups = xdb.find_all("groups")

	if (n > 0) then
		return groups
	else
		return "[]"
	end
end)

get('/build_group_tree', function(params)
	parent_groups = {}
	groups_tab  = {}
	n, parent_groups = xdb.find_by_cond("groups", "group_id IS NULL OR group_id = ''")

	build_group_tree(parent_groups, groups_tab)

	return groups_tab
end)

get('/build_group_options_tree', function(params)
	parent_groups = {}
	options_tab  = {}
	n, parent_groups = xdb.find_by_cond("groups", "group_id IS NULL OR group_id = ''")

	build_group_options_tree(parent_groups, options_tab)

	return options_tab
end)

get('/build_group_options_tree/:id', function(params)
	parent_groups = {}
	n, parent_groups = xdb.find_by_cond("groups", "(group_id IS NULL OR group_id = '') AND id <> " .. params.id)
	options_tab  = {}

	build_group_options_tree_t(parent_groups, options_tab, params.id)

	return options_tab
end)

get('/:id', function(params)
	group = xdb.find("groups", params.id)
	if group then
		return group
	else
		return 404
	end
end)

put('/:id', function(params)
	print(serialize(params))
	ret = xdb.update("groups", params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)

post('/', function(params)
	print(serialize(params))

	ret = xdb.create_return_id('groups', params.request)

	if ret then
		return {id = ret}
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	n, child_groups = xdb.find_by_cond("groups", {group_id = params.id})

	if (n > 0) then
		return 400, "{ERR: group is being deleted has " .. n .. " children}"
	else
		ret = xdb.delete("groups", params.id);
		if ret == 1 then
			return 200, "{}"
		else
			return 500, "{}"
		end
	end

end)
