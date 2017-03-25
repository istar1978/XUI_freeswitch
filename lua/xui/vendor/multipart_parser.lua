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
 * Jiang Xueyun <jiangxueyun@x-y-t.cn>
 *
 */
]]

function stream_read()
	collectgarbage("collect")
	return stream:read()
end

multipart_parser = function(boundary, callback)
	local parser = {}
	parser.boundary = boundary
	parser.callback = callback
	-- parser.state = 0
	parser.buffer = ''
	parser.buffer_len = 0
	parser.part = {}
	parser.parts = {}
	parser.file = nil
	parser.state = 0
	parser.data = ''

	function save_data(data)
		-- body
		if parser.data then
			parser.data = parser.data .. data
			-- print("test 1: " .. parser.data)
		else
			parser.data = data
			-- print("test 2: " .. parser.data)
		end
	end

	function get_data(data)
		if parser.data then
			return (parser.data .. data)
		else
			return data
		end
	end

	function clean_data()
		-- body
		parser.data = nil
	end

	parser.parse_header0 = function(parser, buffer)
		local header_pos = 1

		local bstart, bend = string.find(buffer, parser.boundary)
		if (not bend) then
				-- waiting for boundary
			if parser.state == 0 then
				save_data(buffer)
			else
				parser.write_file(parser, buffer)
			end

			return 0
		end

			-- parser.state = 1 -- parse header
		if (parser.state == 0) then
			header_pos = bend + 1
		end

		while bend do
			if (parser.state == 0 or parser.state == 1) then

				parser.state = 1
				-- parser.buffer = ''

				local hstart, hend = string.find(buffer, '\r\n\r\n', header_pos)

				if (not hend) then
					local left_buf = string.sub(buffer, header_pos)
					save_data(left_buf)
					break
				end

				local headers = string.sub(buffer, header_pos, hend)
				local part = parser.parse_header(parser, headers)

				if (parser.state == 1) then
					parser.write_file(parser, string.sub(buffer, header_pos, hend))
					header_pos = hend + 1

					bstart, bend = string.find(buffer, parser.boundary, header_pos)
				elseif (parser.state == 2) then 
					parser.create_file(parser)

					header_pos = hend + 1

					bstart, bend = string.find(buffer, parser.boundary, header_pos)

					if bend then
						-- The data will be saved in next loop, so do nothing here.
						bstart, bend = string.find(buffer, parser.boundary, header_pos)
					else
						parser.write_file(parser, string.sub(buffer, header_pos))
					end
				end
			elseif (parser.state == 2) then
				parser.state = 0

				-- local data = string.sub(buffer, header_pos, bstart - 1)
				parser.write_file(parser, string.sub(buffer, header_pos, bstart - 1))
				header_pos = bstart

				parser.finish_parse(parser)

				-- local left_buf = string.sub(buffer, header_pos)
				-- save_data(left_buf)
			end
		end
	end

	parser.create_file = function (parser)
		if not (parser.state == 2) then
			return 0
		end

		local abs_filename = utils.tmpname('upload-', parser.part.ext)
		parser.file = assert(io.open(abs_filename, "w"))

		parser.part.abs_filename = abs_filename

		size = 0
	end

	parser.write_file = function (parser, buffer)
		local file = parser.file
		if file and (buffer or string.len(buffer) > 0) then
			print("1 write")
			collectgarbage("collect")
			file:write(buffer)
			print("2 write")
			size = size + string.len(buffer)
		end
	end

	parser.finish_parse = function (parser)
		if parser.file then
			parser.file:close()
			parser.file = nil
		end

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

		parser.part.file_size = 0
	end

	parser.parse_header = function(parser, headers)
		local part = parser.part
		part.headers = headers

		string.gsub(headers, '(.-)\r\n', function(line)
			-- print(line)
			string.gsub(line, '(%S+):%s*(.*)', function(k, v)
				parser.state = 2
				if (k == "Content-Type") then
					part.content_type = v
				elseif (k == "Content-Disposition") then
					part.filename = string.gsub(v, '.*filename="(.-)"', "%1")
					part.ext = string.gsub(part.filename, ".+%.(%w+)$", "%1")
				end
			end)
		end)

		if (parser.state == 2) then
			parser.part = part
		end
	end


	parser.parse = function(parser, data)
		if (data == '') then
			return 0
		end

		local old_data = data

		data = get_data(data)
		local len = string.len(data)
		local min_len = 60

		if parser.boundary then
			min_len = string.len(parser.boundary) + 1
		end

		-- if (parser.buffer) then len = len + string.len(parser.boundary) end
		if (len + parser.buffer_len <=  min_len) then
			save_data(old_data)
			return 0
		-- else
		-- 	clean_data()
		end

		data = parser.buffer .. data
		local has_boundary = string.find(data, parser.boundary)

		if has_boundary then
			local bstart, bend = string.find(data, parser.boundary)
			local has_header = string.find(data, '\r\n\r\n', bstart)

			if (parser.state == 0 and (not has_header)) then
				save_data(old_data)
				return 0
			end

			first_buf = data
			second_buf = ''
			parser.buffer_len = 0
		else
			local len = string.len(data)
			local boundary_len = string.len(parser.boundary)
			first_buf = string.sub(data, 1, len - boundary_len)
			second_buf = string.sub(data, len - boundary_len + 1)
			parser.buffer_len = boundary_len
		end

		clean_data()

		local new_data = first_buf
		parser:parse_header0(new_data)

		parser.buffer = second_buf

		return 0 -- success
	end

	return parser
end
