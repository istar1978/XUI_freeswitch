multipart_parser = function(boundary, callback)
	local parser = {}
	parser.boundary = boundary
	parser.callback = callback
	parser.state = 0
	parser.buffer = ''

	parser.parse_header0 = function(parser)
		local header_pos = 1
		if (parser.state == 0) then
			local bstart, bend = string.find(parser.buffer, boundary)
			if (not bend) then
				-- waiting for boundary
			end

			parser.state = 1 -- parse header
			header_pos = bend + 1
		end

		local hstart, hend = string.find(buffer, '\r\n\r\n', header_pos)
		print(he)
		if (hend and hend > header_pos) then
			parser.state = 2 -- header parsed
			local headers = string.sub(parser.buffer, header_pos, hend)
			local body = string.sub(parser.buffer, hend + 1)

			local part = parse_header(headers)
		else
			buffer = string.sub(buffer, header_pos)
			-- waiting for \r\n\r\n
			print("waiting headers ...")
		end
	end

	parser.parse_header = function(parser, headers)
		print(headers)
		local part = {}
		string.gsub(headers, '(.-)\r\n', function(line)
			print(line)
			string.gsub(line, '(%S+):%s*(.*)', function(k, v)
				print(k)
				print(v)
				print('----\n')
				if (k == "Content-Type") then
					part.content_type = v
				elseif (k == "Content-Disposition") then
					part.filename = string.gsub(v, '.*filename="(.-)"', "%1")
					part.ext = string.gsub(v, filename, "%.[^.]+$")
				end
				print(part.filename)
				print(part.ext)
			end)
		end)
	end

	parser.parse_body = function(parser)
		file:write(parser.buffer)
		parser.buffer = ''
	end

	parser.parse = function(parser, data)
		parser.buffer = parser.buffer .. data

		if state == 0 then
			state,data = parser:parse_header0()
		elseif state == 1 then
			state,buffer = parser:parse_header()
		elseif state == 2 then
			state,buffer = parser:parse_body()
		end

		return 0 -- success
	end

	return parser
end
