multipart_parser = function(boundary, callback)
	local parser = {}
	parser.boundary = boundary
	parser.callback = callback
	-- parser.state = 0
	parser.buffer = ''
	parser.part = {}

	parser.parse_header0 = function(parser, buffer)
		local header_pos = 1
		-- if (parser.state == 0) then
			local bstart, bend = string.find(buffer, boundary)
			if (not bend) then
				-- waiting for boundary

				parser.buffer = parser.buffer .. buffer
				print("get 1")
				return 0
			end

			-- parser.state = 1 -- parse header
			header_pos = bend + 1
		-- end

		-- check for headers
		local hstart, hend = string.find(buffer, '\r\n\r\n', header_pos)
		local body = '';
		if (hend and hend > header_pos) then -- exit headers
			-- parser.state = 2 -- header parsed
			-- clear data
			parser.buffer = ''

			-- parse headers
			local headers = string.sub(buffer, header_pos, hend)
			local part = parser.parse_header(parser, headers)

			-- save data
			body = string.sub(buffer, hend + 1)
		else
			body = buffer
		end

		-- check for end
		local hstart2, hend2 = string.find(body, boundary)
		if hend2 then -- exit boundary at end
			body = string.sub(body, 1, hstart2)
		end

		if body == '' then 
			print("body is nil");
		end

		parser.buffer = parser.buffer .. body
		print("get 2")
	end

	parser.parse_header = function(parser, headers)
		local part = {}
		string.gsub(headers, '(.-)\r\n', function(line)
			print(line)
			string.gsub(line, '(%S+):%s*(.*)', function(k, v)
				if (k == "Content-Type") then
					part.content_type = v
				elseif (k == "Content-Disposition") then
					part.filename = string.gsub(v, '.*filename="(.-)"', "%1")
					part.ext = string.gsub(v, filename, "%.[^.]+$")
				end
			end)
		end)

		parser.part = part

		print(parser.part.filename)
		print(parser.part.content_type)
		print(parser.part.ext)
	end

	-- parser.parse_body = function(parser)
	-- 	file:write(parser.buffer)
	-- 	parser.buffer = ''
	-- end

	parser.parse = function(parser, data)
		-- parser.buffer = parser.buffer .. data

		-- if parser.state == 0 then
		-- 	print("run in parse: 0");
		-- 	parser.state, data = parser:parse_header0(data)
		-- elseif parser.state == 1 then
		-- 	print("run in parse: 1");
		-- 	parser.state, buffer = parser:parse_header()
		-- elseif parser.state == 2 then
		-- 	print("run in parse: 2");
		-- 	parser.state, buffer = parser:parse_body()
		-- end
		parser:parse_header0(data)

		return 0 -- success
	end

	return parser
end
