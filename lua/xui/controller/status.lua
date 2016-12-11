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

function get_status_info()
    cmd = 'status'
    api = freeswitch.API()

    result = api:execute(cmd)
    freeswitch.consoleLog("err", result)
    
    session_num = string.match(result, "(%d+) session%(s%)")
    cpu_idle = string.match(result, '%d+%.?%d+/(%d+%.?%d+)')

    if cpu_idle ~= nil then
        freeswitch.consoleLog("err", "match cpu" .. cpu_idle)
    end
    -- freeswitch.consoleLog("err", "match " .. ret)
    return session_num, cpu_idle
end

get('/', function(params)
    local session_num, cpu_idle = get_status_info()
    if session_num == nil then
        return 404
    else
        local tab = {session_num = session_num, cpu_idle = cpu_idle}
        return tab
    end
end)

post('/cpu', function(params)
    local f_cmd = io.popen("vmstat 1 1|grep -v procs|grep -v us|awk '{print 15}'")
    _result = f_cmd:read("*a")
    f_cmd:close()
    cpu_idle = tonumber(_result)
    cpu_usage = 100 - cpu_idle
    freeswitch.consoleLog("err" , cpu_idle)
    return "{cpu_idle:" .. cpu_usage .. "}"
end)

post('/memory', function(params)
    local  f_cmd = io.popen("free -b")
    _result = f_cmd:read("*a")
    f_cmd:close()
    physical_memory_total, physical_memory_usage = string.match(_result, "Mem:%s+(%d+)%s+(%d+)")
    swap_memory_total, swap_memory_usage = string.match(_result, "Swap:%s+(%d+)%s+(%d+)")
    return string.format("{physical_memory_total:%d, physical_memory_usage:%d," ..
        " swap_memory_total:%d,swap_memory_usage:%d}",
     physical_memory_total, physical_memory_usage, swap_memory_total, swap_memory_usage)
end)

post('/disk', function(params)
    local  f_cmd = io.popen("df -B m|grep -v tmpfs")
    _tmp = "{"
    for i in f_cmd:lines() do
        usage_percent, mount_name = string.match(i, "(%d+%%)%s+([%w,/]+)")
        if usage_percent ~= nil then
            _tmp = _tmp .. mount_name .. ":" .. usage_percent .. ","
        end
    end
    f_cmd:close()
    _tmp = _tmp:match("(.*),$") .. "}"
    return _tmp
end)