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

content_type("text/xml")
require 'xdb'
xdb.bind(xtra.dbh)
require 'xwechat'
require 'm_dict'

-- realm to support multiple wechat accounds, e.g. sipsip, xyt

get('/anyway/:realm', function(params)
	return 	env:getHeader("echostr")
end)

get('/:realm', function(params)
	signature = env:getHeader("signature")
	timestamp = env:getHeader("timestamp")
	nonce = env:getHeader("nonce")
	echostr = env:getHeader("echostr")

	wechat = m_dict.get_obj(params.realm)
	wechat = m_dict.get_obj('WECHAT')

	print(serialize(wechat))

	obj = {}

	print(env:serialize())

	table.insert(obj, wechat.TOKEN)
	table.insert(obj, nonce)
	table.insert(obj, timestamp)

	table.sort(obj, function(a, b)
		return a < b
	end)

	print(serialize(obj))

	str = obj[1] .. obj[2] .. obj[3]
	sha1 = require("sha1")
	sha = sha1(str)
	print(sha)

	if (sha == signature) then
		return echostr
	else
		return 500
	end
end)

post('/:realm', function(params)
	print(serialize(params))
	print(env:serialize())
	req = stream:read()
	print(req)
	xml = utils.xml(req)

	FromUserName = xml:val("FromUserName")
	ToUserName = xml:val("ToUserName")
	CreateTime = xml:val("CreateTime")
	MsgType = xml:val("MsgType")
	Content = xml:val("Content")

	Reply = "OK"

	response = "<xml>" ..
		"<ToUserName><![CDATA[" .. FromUserName .. "]]></ToUserName>" ..
		"<FromUserName><![CDATA[" .. ToUserName .. "]]></FromUserName>" ..
		"<CreateTime>" .. CreateTime .. "</CreateTime>" ..
		"<MsgType><![CDATA[text]]></MsgType>" ..
		"<Content><![CDATA[" .. Reply .. "]]></Content>" ..
		"<FuncFlag>0</FuncFlag>" ..
		"</xml>"
	return response
end)
