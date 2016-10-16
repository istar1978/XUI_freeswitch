-- stream:write("blah")

fun("test", function(params)
	-- p = utils.json_encode(params)
	-- print("p .. " .. p)
	-- print(params.a)
	json = '{"key": "This is a test", "key1": "value1", "data": []}'
	jxtra:write(json);
end)

fun("test2", function(params)
	json = '{"key": "test 2"}'
	jxtra:write(json);
end)
