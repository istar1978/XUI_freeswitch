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

get('/members/', function(params)

		n, fifo_members = xdb.find_all("fifo_members")

		if (fifo_members) then
			return fifo_members
		else
			return "[]"
		end
end)


get('/members/:id', function(params)

	fifo_members = xdb.find("fifo_members", params.id)

	if fifo_members then
		
		return fifo_members
	else
		return 404
	end
end)


put('/members/:id', function(params)
	print(serialize(params))
	ret = xdb.update("fifo_members", params.request)
	if ret then
		return 200, "{}"
	else
		return 500
	end
end)

post('/members/', function(params)
	print(serialize(params))

	ret = xdb.create_return_id("fifo_members",params.request)

	if ret then
		return {id = ret}
	else
		return 500, "{}"
	end
end)

delete('/members/:id', function(params)
	ret = xdb.delete("fifo_members", params.id);

	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
