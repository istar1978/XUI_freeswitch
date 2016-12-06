require 'multipart_parser'

post('/', function(params)
print(env:serialize())
	local api = freeswitch.API()
	local ctype = xtra.url_decode(env:getHeader("content-type"))
	local content_length = tonumber(env:getHeader("content-length"))

	if content_length == 0 or content_length > 10 * 1024 * 1024 then
		return 500
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

	print(filename)
	print(ctype)
	print(content_length)

	expect = env:getHeader("expect")

	if expect and expect:match("100%-continue") then
		-- response_100_continue()
		stream:write("HTTP/1.1 100 Continue\r\n")
		stream:write("X-IM-FileID: " .. filename .. "\r\n\r\n")
	end

	if multipart then
		boundary=string.gsub(ctype, "^.*boundary=([^;]+).*$", "%1")
		print("boundary: " .. boundary)
	else
		filename = utils.tmpname('upload-')
		file = assert(io.open(abs_filename, "w"))
	end

	while received < size do
		local x = stream:read()
		local len = x:len()
		received = received + len
		print("received: " .. len .. " total: " .. received .. " size: " .. size)

		if len == 0 then -- read eof
			print("EOF")
			if parser and parser.parts then
				-- todo fix parser
				local media_file = xdb.create_return_object('media_files', {
					name = boundary,
					description = boundary
				})

				if media_file then
					table.insert(uploaded_files, media_file)
					found = found + 1
				end
			end

			break
		end

		if (multipart) then
			if not parser then parser = multipart_parser(boundary) end

			ret = parser:parse(x)

			if (not ret == 0) then break end
		else
			file:write(x)
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
