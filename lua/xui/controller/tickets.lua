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
require 'xwechat'
require 'm_dict'
require 'xtra_config'
require 'utils'
xdb.bind(xtra.dbh)

get('/', function(params)
	n, orders = xdb.find_all("tickets")
	if (n > 0) then
		return orders
	else
		return "[]"
	end
end)

get('/:id', function(params)
	ticket = xdb.find("tickets", params.id)
	if ticket then
		return ticket
	else
		return 404
	end
end)

get('/:id/logs', function(params)
	n, logs = xdb.find_by_cond("ticket_logs", {ticket_id = params.id}, "created_epoch DESC")

	if (n > 0) then
		return logs
	else
		return "[]"
	end
end)

post('/', function(params)

	local member = {}
	member.time = os.date("%Y年%m月%d日%H时%M分")
	member.tid = params.request.tid
	member.dealname = params.request.dealname
	member.content = params.request.content
	order = xdb.create_return_object('ticket_log', member)
	if params.request.uid then
		xdb.update_by_cond("tickets",{id = params.request.tid}, {uid = params.request.uid})
	end

	local user = xdb.find("users", params.request.uid)
	local openid = user.openid
	local wechat = m_dict.get_obj('WECHAT')

	xwechat.access_token('sipsip')
	token = xwechat.get_token('sipsip', wechat.APPID, wechat.APPSEC)

	-- xwechat.get_callback_ip()

	print(xwechat.sign('sipsip', "a", "b", "c"))

	local ajson = {}
	ajson.touser = openid
	ajson.template_id = '7cYHIHuEJe5cKey0KOKIaCcjhUX2vEVHt1NcUAPm7xc'
	ajson.url = 'http://shop.x-y-t.cn/a/'..params.request.tid
	ajson.data = {}
	ajson.data.fist = {}
	ajson.data.fist.value = ''
	ajson.data.fist.color = '#173177'
	ajson.data.keyword1 = {}
	ajson.data.keyword1.value = '招远交通工单'
	ajson.data.keyword1.color = '#173177'
	ajson.data.keyword2 = {}
	ajson.data.keyword2.value = member.time
	ajson.data.keyword2.color = '#173177'
	ajson.data.keyword3 = {}
	ajson.data.keyword3.value = 'Admin'
	ajson.data.keyword3.color = '#173177'
	ajson.data.remark = {}
	ajson.data.remark.value = member.content
	ajson.data.remark.color = '#173177'
	-- local json_text = '{"data":{"fist":{"color":"#173177","value":"啦啦啦"},"keyword1":{"color":"#173177","value":"啦啦啦"},"keyword2":{"color":"#173177","value":"哈哈"},"keyword3":{"color":"#173177","value":"3"},"remark":{"color":"#173177","value":"哇哇"}},"template_id":"7cYHIHuEJe5cKey0KOKIaCcjhUX2vEVHt1NcUAPm7xc","touser":"ojc83wtKp0PlAeZ4BjbJAU0KL7Wo","url":"http://weixin.qq.com"}'

	json_text = utils.json_encode(ajson)

	xwechat.send_template_msg('sipsip', json_text)

	if order then
		return order
	else
		return 500, "{}"
	end
end)

post('/:id/logs', function(params)
	print(serialize(params))

	ticket = {}
	ticket.id = params.id
	ticket.current_user_id = params.request.current_user_id

	xdb.update("tickets", ticket)

	log = params.request
	log.ticket_id = params.id
	log.current_user_id = nil
	log.user_name = 'Admin' -- TODO: hardcoded

	ret = xdb.create_return_object("ticket_logs", log)

	if ret then
		return ret
	else
		return 500, "{}"
	end
end)

delete('/:id', function(params)
	ret = xdb.delete("tickets", params.id);
	xdb.delete("ticket_log", {tid = params.id});
	if ret == 1 then
		return 200, "{}"
	else
		return 500, "{}"
	end
end)
