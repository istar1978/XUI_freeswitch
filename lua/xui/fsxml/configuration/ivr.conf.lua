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

function build_actions(ivr)
	action = ""
	xdb.find_by_cond("ivr_actions", {ivr_menu_id = ivr.id}, id, function(row)

		action = action .. [[<entry action="]] .. row.action .. [[" digits="]] ..
			row.digits .. [[" param="]] .. row.args .. [["/>]] .. "\n"
	end)
	return action
end

function build_ivrs()
	local ivrs = ""

	xdb.find_all("ivr_menus", 'id', function(row)
		ivrs = ivrs .. '<menu name="' .. row.name ..
			'" greet-long="' .. row.greet_long ..
			'" greet-short="' .. row.greet_short ..
			'" invalid-sound="' .. row.invalid_sound ..
			'" exit-sound="' .. row.exit_sound ..
			'" timeout="' .. row.timeout ..
			'" max-failures="' .. row.max_failures ..
			'" max-timeouts="' .. row.max_timeouts ..
			'" inter-digit-timeout="' .. row.inter_digit_timeout ..
			'" digit-len="' .. row.digit_len ..
			'" transfer-sound="' .. row.transfer_sound ..
			'" exec-on-max-failures="' .. row.exec_on_max_failures ..
			'" exec-on-max-timeouts="' .. row.exec_on_max_timeouts ..
			'" confirm-macro="' .. row.confirm_macro ..
			'" confirm-key="' .. row.confirm_key ..
			'" max-failures="' .. row.max_failures ..
			'" tts-engine="' .. row.tts_engine ..
			'" tts-voice="' .. row.tts_voice ..
			'" confirm-attempts="' .. row.confirm_attempts ..
			'" pin="' .. row.pin ..
			'" pin-file="' .. row.pin_file ..
			'" bad-pin-file="' .. row.bad_pin_file ..
			'">' ..
			build_actions(row) .. '</menu>\n'
	end)

	return ivrs
end


XML_STRING=[[
<configuration name="ivr.conf" description="IVR menu">
<menus>]] ..
	build_ivrs() ..
	[[</menus>
</configuration>
]]
