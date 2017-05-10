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
	n, orders = xdb.find_all("tickets", "id desc")
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

get('/:id/comments', function(params)
	n, comments = xdb.find_by_cond("ticket_comments", {ticket_id = params.id}, "created_epoch DESC")
	local comments_res = {}
	for i, v in pairs(comments) do
		local n, users = xdb.find_by_cond("wechat_users", {user_id = v.user_id})
		local user = users[1]
		v.avatar_url = user.headimgurl
		table.insert(comments_res,v)
	end
	if (n > 0) then
		return comments_res
	else
		return "[]"
	end
end)

post('/comments', function(params)
	local comment = {}
	comment.content = env:getHeader("content")
	comment.ticket_id = env:getHeader("ticket_id")
	comment.user_id = env:getHeader("user_id")
	comment.user_name = env:getHeader("user_name")
	freeswitch.consoleLog("ERR",utils.json_encode(comment))
	local ret = xdb.create_return_object('ticket_comments',comment)
	return utils.json_encode(ret)
end)

post('/hb', function(params)
	tids = env:getHeader("tids")
	tid_t = utils.json_decode(tids)
	local tid = ''
	for i, v in pairs(tid_t) do
		if(tid == '') then
			tid = tid .. v
		else
			tid = tid .. ',' .. v
			--加个事务？
			--n, check = xdb.find_by_sql("select * from tickets where id in(" .. tid .. ")")
			--检查check内，当前一个与上一个比较，如果电话、用户相同，则执行delete
			xdb.delete("tickets", v);
			--事务结束
		end
	end
	for i, v in pairs(check) do
		freeswitch.consoleLog("ERR",utils.json_encode(v.cid_number))
	end
	
	sql = "update ticket_comments set ticket_id = " .. tid_t[1] .. " where ticket_id in(" .. tid .. ")";
	n, ret = xdb.find_by_sql(sql)
	if (n > 0) then
		return '{"res":"ok"}'
	else
		return '{}'
	end
end)

get('/end/:id',function(params)
	local pid = params.id
	ret = xdb.update_by_cond("tickets", { id = pid }, { status = '2' })
	if ret then
		redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9456c585ce6eb6f7&redirect_uri=http%3a%2f%2fshop.x-y-t.cn%2fwe%2f' .. pid .. '&response_type=code&scope=snsapi_base&state=123#wechat_redirect')
	else
		return 500
	end
end)

post('/:id/comments', function(params)
	print(serialize(params))
	ticket = {}
	ticket.id = params.id
	ticket.current_user_id = params.request.current_user_id
	xdb.update("tickets", ticket)
	local comment = {}
	-- comment = params.request
	comment.ticket_id = params.id
	comment.user_id = params.request.current_user_id
	comment.content = params.request.content
	comment.user_name = params.request.user_name or 'Admin' -- TODO: hardcoded
	ret = xdb.create_return_object("ticket_comments", comment)
	local member = {}
	member.time = os.date("%Y年%m月%d日%H时%M分")
	member.ticket_id = params.id
	member.dealname = params.request.dealname
	member.content = params.request.content
	local n, users = xdb.find_by_cond("wechat_users", {user_id = params.request.current_user_id})
	local user = users[1]
	ret.avatar_url = user.headimgurl
	local openid = user.openid
	local wechat = m_dict.get_obj('WECHAT/xyt')
	xwechat.access_token('sipsip')
	token = xwechat.get_token('sipsip', wechat.APPID, wechat.APPSEC)
	freeswitch.consoleLog("ERR", xwechat.access_token('sipsip'))
	-- xwechat.get_callback_ip()
	print(xwechat.sign('sipsip', "a", "b", "c"))
	local ajson = {}
	ajson.touser = openid
	ajson.template_id = '7cYHIHuEJe5cKey0KOKIaCcjhUX2vEVHt1NcUAPm7xc'
	ajson.url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9456c585ce6eb6f7&redirect_uri=http%3a%2f%2fshop.x-y-t.cn%2fwe%2f' .. member.ticket_id .. '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
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
