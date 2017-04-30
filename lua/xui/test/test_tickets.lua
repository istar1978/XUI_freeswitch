print("test start ... \n")

local cur_dir = debug.getinfo(1).source;
cur_dir = string.gsub(cur_dir, "^@(.+)/test/test_tickets.lua$", "%1")
package.path = package.path .. ";" .. cur_dir .. "/vendor/?.lua"
package.path = package.path .. ";" .. cur_dir .. "/model/?.lua"

stream:write(package.path)
stream:write("test start\n")

require 'xdb'
require 'xwechat'
require 'm_dict'
require 'xtra_config'
require 'utils'

if config.db_auto_connect then xdb.connect(config.dsn) end

ticket = {
	subject = "test",
	cid_number = "1234",
	content = "test ticket blah blah",
	status = 'TICKET_ST_NEW'
}

xdb.create("tickets", ticket)


stream:write("test done\n")
