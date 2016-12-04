print("test start ... \n")

local cur_dir = debug.getinfo(1).source;
cur_dir = string.gsub(debug.getinfo(1).source, "^@(.+/vendor)/test/test.lua$", "%1")
package.path = package.path .. ";" .. cur_dir .. "/?.lua"

-- stream:write(package.path)
stream:write("test start\n")

require('xdb')

function serialize(o)
	s = ""

	if type(o) == "number" then
		s = s .. o
	elseif type(o) == "string" then
		s = s .. string.format("%q", o)
	elseif type(o) == "table" then
		s = s .. "{\n"
		for k, v in pairs(o) do
			s = s .. '  ' .. k .. ' = '
			s = s .. serialize(v)
			s = s .. ",\n"
		end
		s = s .. "}"
	elseif type(o) == "boolean" then
		if o then
			s = s .. "true"
		else
			s = s .. "false"
		end
	else
		s = s .. " [" .. type(o) .. "]"
	end

	return s
end


xdb.connect("/tmp/test.db")

xdb.dbh:test_reactive("SELECT * FROM test_table",
                  "DROP TABLE test_table",
                  "CREATE TABLE test_table (id INTEGER PRIMARY KEY, name VARCHAR(255))")

stream:write('========= insert\n')
xdb.create('test_table', {name = 'test1'})
xdb.create('test_table', {name = 'test2'})

stream:write('========= find\n')

test1 = xdb.find('test_table', 1)
stream:write(serialize(test1))
stream:write('\n')

test1 = xdb.find('test_table', '1')
stream:write(serialize(test1))
stream:write('\n')

stream:write('========= find all\n')

n, tests = xdb.find_all('test_table')
stream:write(n .. ": ")
stream:write(serialize(tests))
stream:write('\n')

stream:write('========= find all sort\n')
n, tests = xdb.find_all('test_table', "name DESC")
stream:write(n .. ": ")
stream:write(serialize(tests))
stream:write('\n')

stream:write('========= create_return_id\n')
id = xdb.create_return_id('test_table', {name = 'test3'})
test3 = xdb.find('test_table', id)
stream:write(serialize(test3))
stream:write('\n')
stream:write('id ' .. id .. "\n")

stream:write('========= create return object\n')
test4 = xdb.create_return_object('test_table', {name = 'test4'})
stream:write(serialize(test4))
stream:write('\n')

stream:write('========= update\n')
ret = xdb.update('test_table', {id = id, name = 'blah'})
stream:write('updated ' .. ret .. '\n')
assert( ret == 1)

stream:write('========= find_by_cond\n')
testblah = xdb.find_by_cond('test_table', {name = 'blah'})
stream:write(serialize(testblah))
stream:write('\n')


stream:write('========= find_by_cond callback\n')
testblah = xdb.find_by_cond('test_table', {name = 'blah'}, nil, function(row)
	stream:write(serialize(row))
	stream:write('\n')
end)

stream:write('========= delete\n')
ret = xdb.delete('test_table', id)
assert(ret == 1)

ret = xdb.delete('test_table')
stream:write('deleted ' .. ret .. '\n')


stream:write('\n')
stream:write("done\n")
xdb.release()
