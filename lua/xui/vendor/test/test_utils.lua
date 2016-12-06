print("test start ... \n")

local cur_dir = debug.getinfo(1).source;
cur_dir = string.gsub(debug.getinfo(1).source, "^@(.+/vendor)/test/test_utils.lua$", "%1")
package.path = package.path .. ";" .. cur_dir .. "/?.lua"

-- stream:write(package.path)
stream:write("test start\n")

require('utils')

assert(utils.apply_dnc("01234", "-0+9") == '91234')
assert(utils.apply_dnc("01234", "-0") == '1234')
assert(utils.apply_dnc("01234", "+9") == '901234')
assert(utils.apply_dnc("01234", "0") == '01234')
assert(utils.apply_dnc("01234", "r3999") == '99934')
assert(utils.apply_dnc("01234", "R3999") == '01999')
assert(utils.apply_dnc("01", "r3999") == '999')
assert(utils.apply_dnc("01", "R3999") == '999')
assert(utils.apply_dnc("01234", "/^(.*)[0-9][0-9]$/$1/") == '012')

stream:write("test done\n")
