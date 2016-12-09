require 'multipart_parser'
require 'xdb'

post('/', function(params)
	print(env:serialize())
	local api = freeswitch.API()
	local ctype = xtra.url_decode(env:getHeader("Content-Type"))
	local content_length = tonumber(env:getHeader("Content-Length"))

	print("ctype: "..ctype.." content_length: "..content_length.."\n");

	local max_body_size = 100 * 1024 * 1024

	if content_length == 0 or content_length > max_body_size then
		print("Max body size " .. max_body_size)
		return 413, {error = "Max body size " .. max_body_size}
	end

	local multipart = string.find(ctype, "multipart")
	local size = tonumber(content_length)
	local filename
	local file
	local received = 0
	local files = {}
	local boundary
	local parser
	local uploaded_files = {}
	local found = 0

	-- print(multipart)

	expect = env:getHeader("expect")

	if expect and expect:match("100%-continue") then
		-- response_100_continue()
		print("run");
		stream:write("HTTP/1.1 100 Continue\r\n")
		-- stream:write("X-IM-FileID: " .. filename .. "\r\n\r\n")
	end

	boundary=string.gsub(ctype, "^.*boundary=([^;]+).*$", "%1")
	-- print("boundary: " .. boundary)

	if (not multipart) then
		filename = utils.tmpname('upload-')
		file = assert(io.open(filename, "w"))
	end

	while received < size do
		local x = stream:read()
		local len = x:len()
		received = received + len
		-- print("received: " .. len .. " total: " .. received .. " size: " .. size)

		if not parser then parser = multipart_parser(boundary) end

		if (not multipart) then
			file:write(x)
		else
			ret = parser:parse(x)
		end

		if (len == 0 or received == size) then -- read eof
			print("EOF")

			if parser and parser.parts then
				xdb.bind(xtra.dbh)

				for k, v in pairs(parser.parts) do
					local record = {}
					record.name = v.filename
					record.ext = v.ext
					record.original_file_name = v.filename
					record.mime = v.content_type
					record.description = 'UPLOAD'
					record.abs_path = v.abs_filename
					record.dir_path = config.upload_path
					record.rel_path = string.sub(record.abs_path, string.len(record.dir_path) + 2)
					record.file_size = "" .. v.file_size .. ""

					record.channel_uuid = env:getHeader("Core-UUID")
					record.created_epoch = "" .. os.time() .. ""
					record.updated_epoch = record.created_epoch

					local media_file = xdb.create_return_object('media_files', record)

					if media_file then
						table.insert(uploaded_files, media_file)
					end
				end
			end

			if (not multipart) then
				local record = {}
				record.mime = ctype
				record.description = boundary
				record.abs_path = filename
				record.dir_path = config.upload_path
				record.rel_path = string.sub(record.abs_path, string.len(record.dir_path) + 2)
				record.file_size = "" .. size .. ""
				record.channel_uuid = env:getHeader("Core-UUID")
				record.created_epoch = "" .. os.time() .. ""
				record.updated_epoch = record.created_epoch

				table.insert(files, record)

				local media_file = xdb.create_return_object('media_files', record)

				if media_file then
					table.insert(uploaded_files, media_file)
				end
			end

			break
		end
		-- freeswitch.msleep(1000) -- emulate slow network upload
	end

	if file then file:close() end

	if found then
		return uploaded_files
	else
		return "[]"
	end
end)
