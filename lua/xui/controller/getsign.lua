get('/', function(params)
	require 'xdb'
	require 'xwechat'
	require 'utils'
	require 'm_dict'
	require 'xtra_config'
	sha1 = require("sha1")
	xdb.bind(xtra.dbh)
	local timestamp = os.time()
	local nonceStr = 'AbEfgh' .. timestamp
	local url = 'http://shop.x-y-t.cn'
	wechat = m_dict.get_obj('WECHAT/xyt')
	access_token = xwechat.get_token('WECHAT/xyt',wechat.APPID,wechat.APPSEC)
	local gurl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=' .. access_token
	local body = api:execute("curl", gurl)
	local res = utils.json_decode(body)
	local ticket = res.ticket
	local str = "jsapi_ticket=" .. ticket .. "&noncestr=" .. nonceStr .. "&timestamp=" .. timestamp .. "&url=" .. url
	local signature = sha1(str)
	freeswitch.consoleLog('ERR',signature)
	return {appId = wechat.APPID, nonceStr = nonceStr, timestamp = timestamp, url = url, signature = signature, ticket = ticket}
end)
