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
 * Jiang Xueyun <jiangxueyun@x-y-t.cn>
 *
 */
]]

multipart_parser = function(boundary, callback)
	local parser = {}
	parser.boundary = boundary
	parser.callback = callback
	-- parser.state = 0
	parser.buffer = ''
	parser.part = {}
	parser.parts = {}
	parser.file = {}
	parser.files = {}
	parser.state = 0

	parser.parse_header0 = function(parser, buffer)
		local header_pos = 1
		-- if (parser.state == 0) then
			local bstart, bend = string.find(buffer, boundary)
			if (not bend) then
				-- waiting for boundary

				parser.write_file(parser, buffer)
				print("get 1 state=" .. parser.state)
				return 0
			end

			-- parser.state = 1 -- parse header
		if (parser.state == 0) then
			header_pos = bend + 1
		end
		-- end

		while bend do
			if parser.state == 0 then
				print("get 2 state=" .. parser.state);

				parser.state = 1
				parser.buffer = ''

				local hstart, hend = string.find(buffer, '\r\n\r\n', header_pos)

				if (not hend) then
					break
				end

				local headers = string.sub(buffer, header_pos, hend)
				local part = parser.parse_header(parser, headers)

				parser.create_file(parser)

				header_pos = hend + 1

				bstart, bend = string.find(buffer, boundary, header_pos)

				if (not bend) then
					print("get 4 state=" .. parser.state);
					parser.write_file(parser, string.sub(buffer, header_pos))
				else
					-- The data will be saved in next loop, so do nothing here.
					bstart, bend = string.find(buffer, boundary, header_pos)
				end
			elseif parser.state == 1 then
				parser.state = 0

				-- local data = string.sub(buffer, header_pos, bstart - 1)
				parser.write_file(parser, string.sub(buffer, header_pos, bstart - 1))

				parser.finish_parse(parser)
			end
		end


		-- -- check for headers
		-- local hstart, hend = string.find(buffer, '\r\n\r\n', header_pos)
		-- local body = '';
		-- if (hend and hend > header_pos) then -- exit headers
		-- 	print("get 2")
		-- 	-- parser.state = 2 -- header parsed
		-- 	-- clear data
		-- 	parser.buffer = ''

		-- 	-- parse headers
		-- 	local headers = string.sub(buffer, header_pos, hend)
		-- 	local part = parser.parse_header(parser, headers)

		-- 	-- save data
		-- 	body = string.sub(buffer, hend)
		-- else
		-- 	body = buffer
		-- end

		-- -- check for end
		-- local hstart2, hend2 = string.find(body, boundary)
		-- if hend2 then -- exit boundary at end
		-- 	print("get 3")
		-- 	print(buffer)
		-- 	body = string.sub(body, 1, hstart2 - 1)
		-- 	parser.buffer = parser.buffer .. body

		-- 	parser.finish_parse(parser);

		-- 	return 1
		-- end

		-- if body == '' then
		-- 	print("body is nil");
		-- end

		-- parser.buffer = parser.buffer .. body
		-- print("get 4")
		-- return 2
	end

	parser.create_file = function (parser)
		local abs_filename = utils.tmpname('upload-', parser.part.ext)
		parser.file = assert(io.open(abs_filename, "w"))

		parser.part.abs_filename = abs_filename

		print("file_name=" .. parser.part.abs_filename)
		size = 0
	end

	parser.write_file = function (parser, buffer)
		local file = parser.file
		file:write(buffer)
		size = size + string.len(buffer)
	end


	parser.finish_parse = function (parser)
		local file = parser.file
				
		file:close()

		parser.part.file_size = size

		-- update table

		local part = {}

		part.filename = parser.part.filename
		part.abs_filename = parser.part.abs_filename
		part.file_size = parser.part.file_size
		part.content_type = parser.part.content_type
		part.ext = parser.part.ext
		part.headers = parser.part.headers

		table.insert(parser.parts, part)
		table.insert(parser.files, parser.file)

		utils.print_r(parser.parts)
	end

	parser.parse_header = function(parser, headers)
		local part = parser.part
		part.headers = headers

		string.gsub(headers, '(.-)\r\n', function(line)
			-- print(line)
			string.gsub(line, '(%S+):%s*(.*)', function(k, v)
				if (k == "Content-Type") then
					part.content_type = v
				elseif (k == "Content-Disposition") then
					part.filename = string.gsub(v, '.*filename="(.-)"', "%1")
					part.ext = string.gsub(part.filename, ".+%.(%w+)$", "%1")
				end
			end)
		end)

		parser.part = part
		print("filename="..part.filename);
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
		if (data == '') then
			return 0
		end
		parser:parse_header0(data)

		return 0 -- success
	end

	return parser
end
