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

get('/', function(params)
	startDate = env:getHeader('startDate')
	last = env:getHeader('last')

	if not startDate then
		if not last then last = "7" end

		n, fifocdrs = xdb.find_by_time_of_fifo("fifo_cdrs", last)

		if (n > 0) then
			return fifocdrs
		else
			return "[]"
		end

	else
		local endDate = env:getHeader('endDate')
		local ani = env:getHeader('ani')
		local dest_number = env:getHeader('dest_number')
		local bridged_number = env:getHeader('bridged_number')

		cond = xdb.date_cond_of_fifo("start_epoch", startDate, endDate) ..
					xdb.if_cond("ani", ani) ..
					xdb.if_cond("dest_number", dest_number) ..
					xdb.if_cond("bridged_number", bridged_number)

		n, fifocdrs = xdb.find_by_cond("fifo_cdrs", cond)

		if (n > 0) then
			return fifocdrs
		else
			return "[]"
		end
	end

end)

get('/:channel_uuid', function(params)
	n, fifocdrs = xdb.find_by_cond("fifo_cdrs", {channel_uuid = params.channel_uuid}, "start_epoch", nil, 1)

	sql = "select name from media_files where channel_uuid = '" .. params.channel_uuid .. "'"
	n, result = xdb.find_by_sql(sql)

	if n > 0 then
		return {fifocdrs = fifocdrs, result = result}
	else
		return 404
	end
end)
