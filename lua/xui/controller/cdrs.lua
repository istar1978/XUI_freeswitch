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

xtra.start_session()
xtra.require_login()
-- freeswitch.consoleLog("INFO", xtra.session.user_id .. "\n")

get('/', function(params)
	startDate = env:getHeader('startDate')
	last = env:getHeader('last')

	if not startDate then
		if not last then last = "7" end

		n, cdrs = xdb.find_by_time("cdrs", last)

		if (n > 0) then
			return cdrs
		else
			return "[]"
		end

	else
		local endDate = env:getHeader('endDate')
		local cidNumber = env:getHeader('cidNumber')
		local destNumber = env:getHeader('destNumber')

		local cond = xdb.date_cond("start_stamp", startDate, endDate) ..
					xdb.if_cond("caller_id_number", cidNumber) ..
					xdb.if_cond("destination_number", destNumber)

		n, cdrs = xdb.find_by_cond("cdrs", cond)

		if (n > 0) then
			return cdrs
		else
			return "[]"
		end
	end
end)

get('/:uuid', function(params)
	n, cdrs = xdb.find_by_cond("cdrs", {uuid = params.uuid}, "start_stamp", nil, 1)

	if n > 0 then
		return cdrs[1]
	else
		return 404
	end
end)
