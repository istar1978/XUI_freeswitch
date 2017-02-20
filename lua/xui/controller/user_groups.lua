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

get('/:id', function(params)
	n, groups = xdb.find_all("groups")
	local group_res = {}
	for i, v in pairs(groups) do
		local checkshow = ""
		sql = "select * from user_groups where user_id = " .. params.id .. " and group_id = " .. v.id
		checked = xdb.find_by_sql(sql,function(row)
			if row then
				checkshow = 'checked'
			end
		end)
		v['checkshow'] = checkshow
		table.insert(group_res,v)
	end
	if (group_res) then
		return group_res
	else
		return "[]"
	end
end)

post('/', function(params)
		print(serialize(params))
		ret = xdb.create_return_id("user_groups", params.request);
		return "{}";
end)

delete('/', function(params)
	ret = xdb.delete("user_groups", params.request);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
