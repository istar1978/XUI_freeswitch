local user = params:getHeader("user")
local domain = params:getHeader("domain")
local purpose = params:getHeader("purpose")
local vars = ""
local pars = ""
local found = false

-- freeswitch.consoleLog("INFO", "purpose" .. purpose)

if user then
	xdb.find_by_cond("users", {extn = user}, nil, function(row)
		found = true

		cid_name = row.cid_name or row.name
		cid_number = row.cid_number or row.extn

		pars= '<param name="password" value="' .. row.password .. '"/>' ..
				'<param name="vm-password" value="' .. row.vm_password .. '"/>'

		vars =  '<variable name="user_context" value="' .. row.context .. '"/>' ..
				'<variable name="effective_caller_id_name" value="' .. cid_name .. '"/>' ..
				'<variable name="effective_caller_id_number" value="' .. cid_number .. '"/>'
	end)
end

if (found) then
	XML_STRING = [[<domain name="]] .. domain .. [[">
		<user id="]] .. user .. [[">
			<params>
				<param name="dial-string" value="{^^:sip_invite_domain=${dialed_domain}:presence_id=${dialed_user}@${dialed_domain}}${sofia_contact(*/${dialed_user}@${dialed_domain})},${verto_contact(${dialed_user}@${dialed_domain})}"/>
				<!-- These are required for Verto to function properly -->
				<param name="jsonrpc-allowed-methods" value="verto.subscribe,verto,txtapi,jsapi,xmlapi,makeCall,callcenter_config"/>
				<param name="jsonrpc-allowed-jsapi" value="cti,mips,fsapi,show,status,jsjson,lua,luarun"/>
				<param name="jsonrpc-allowed-fsapi" value="bgapi,uuid_phone_event,status,show,fsapi,jsapi,sofia,list_users,callcenter_config,jsjson,conference"/>
				<param name="jsonrpc-allowed-event-channels" value="demo,conference,conference-liveArray,presence,cti,FSevent"/>
				]] .. pars .. [[
			</params>
			<variables>
				<variable name="record_stereo" value="true"/>
				<variable name="transfer_fallback_extension" value="operator"/>
				<variable name="toll_allow" value="domestic,international,local"/>
				<variable name="accountcode" value="1000"/>
				<variable name="outbound_caller_id_name" value="FSXUI"/>
				<variable name="outbound_caller_id_number" value="0000000"/>
				<variable name="callgroup" value="techsupport"/>
				]] .. vars .. [[
			</variables>
		</user>
	</domain>]]
end
