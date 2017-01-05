--[[
/*
 * HTML5 GUI Framework for FreeSWITCH - XUI
 * Copyright (C) 2016-2016, Seven Du <dujinfang@x-y-t.cn>
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

get('/:mac', function(params)
	utils.print_r(params)
	y = string.sub(params.mac,1,12)
	t = string.sub(params.mac,4,15)
	if params.mac then
	xdb.dbh:query("SELECT * FROM devices AS a JOIN user_devices AS c ON c.mac_id=a.id JOIN users AS b ON b.id=c.user_id WHERE a.mac='" ..t.. "'",function(row)
	tab = [[<?xml version="1.0" encoding="UTF-8"?><gs_provision version="1"><config version="1">]]..
	[[<P271>1</P271>]]..
	[[<P2312>]]..row.domain..[[</P2312>]]..
	[[<P270>]]..row.extn..[[</P270>]]..
	[[<P47>]]..row.domain..[[</P47>]]..
	[[<P48>]]..row.domain..[[</P48>]]..
	[[<P35>]]..row.cid_number..[[</P35>]]..
	[[<P36>]]..row.cid_name..[[</P36>]]..
	[[<P3>]]..row.extn..[[</P3>]]..
	[[<P34>]]..row.password..[[</P34>]]..
	[[</config></gs_provision>]]
	end)
	xdb.dbh:query("SELECT * FROM devices AS a JOIN user_devices AS c ON c.mac_id=a.id JOIN users AS b ON b.id=c.user_id WHERE a.mac='" ..y.. "'",function(row)
	tab = [[#!version:1.0.0.1
	##File header "#!version:1.0.0.1" can not be edited or deleted.##
	account.1.sip_server.1.expires = 300
	account.1.sip_server.1.retry_counts = 3
	account.1.sip_server.1.register_on_enable = 1
	account.1.sip_server.1.failback_mode = 3
	account.1.sip_server.1.failback_timeout = 120
	account.1.fallback.redundancy_type = 0
	account.1.fallback.timeout = 120
	account.1.unregister_on_reboot = 1
	account.1.reg_fail_retry_interval = 30
	account.1.sip_server.2.expires = 300
	account.1.sip_server.2.retry_counts = 3
	account.1.sip_server.2.register_on_enable = 1
	account.1.nat.rport = 1
	account.1.enable = 1]].."\n"..

	[[account.1.label = ]]..row.extn.."\n".. 
	[[account.1.display_name = ]]..row.extn.."\n"..
	[[account.1.auth_name = ]]..row.cid_name.."\n"..
	[[account.1.user_name = ]]..row.cid_number.."\n"..
	[[account.1.password = ]]..row.password.."\n"..

	[[account.1.sip_server.1.address = ]]..row.domain.."\n"..
	[[account.1.sip_server.1.port = 0
	account.1.sip_server.1.transport_type = 2

	account.1.sip_server.2.address = 
	account.1.sip_server.2.port = 5060
	account.1.sip_server.2.transport_type = 1

	account.1.static_cache_pri = 1

	phone_setting.called_party_info_display.enable = 1
	account.1.cid_source = 4

	account.2.sip_server.1.expires = 300
	account.2.sip_server.1.retry_counts = 3
	account.2.sip_server.1.register_on_enable = 1
	account.2.sip_server.1.failback_mode = 3
	account.2.sip_server.1.failback_timeout = 120
	account.2.fallback.redundancy_type = 0
	account.2.fallback.timeout = 120
	account.2.unregister_on_reboot = 1
	account.2.reg_fail_retry_interval = 30
	account.2.sip_server.2.expires = 300
	account.2.sip_server.2.retry_counts = 3
	account.2.sip_server.2.register_on_enable = 1
	account.2.nat.rport = 1
	account.2.enable = 1
	account.2.label = 
	account.2.display_name = 
	account.2.auth_name = 
	account.2.user_name = 
	account.2.password = 
	account.2.sip_server.1.address = 
	account.2.sip_server.1.port = 
	account.2.sip_server.1.transport_type = 2
	account.2.outbound_proxy.1.address = 
	account.2.outbound_proxy.1.port = 
	account.2.outbound_proxy_enable = 1
	account.1.static_cache_pri = 1

	auto_provision.server.url = http://192.168.3.67:8081/api/provision
	security.trust_certificates = 0]]
	end)

	return tab

	end
end)


