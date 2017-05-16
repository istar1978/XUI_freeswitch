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

xtra.start_session()
xtra.require_login()

content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)

get('/:id', function(params)
	n, profiles = xdb.find_all("conference_profiles")
	local group_res = {}
	for i, v in pairs(profiles) do
		local selectshow = ""
		sql = "select * from room_profiles where room_id = " .. params.id .. " and profile_id = " .. v.id
		selected = xdb.find_by_sql(sql,function(row)
			if row then
				selectshow = 'selected'
			end
		end)
		v['selectshow'] = selectshow
		table.insert(group_res,v)
	end
	if (profiles) then
		return group_res
	else
		return "[]"
	end
end)

post('/', function(params)
		print(serialize(params))
		xdb.delete("room_profiles", {room_id=params.request.room_id});
		ret = xdb.create_return_id("room_profiles", params.request);
		return "{}";
end)
