function build_event_socket_conf(event)
	local settings = ""
	local cond = {realm = 'event_socket', disabled = 0}

	xdb.find_by_cond("params", cond, 'id', function (row)
		settings = settings .. '<param name ="' .. row.k .. '" value="' .. row.v .. '"/>'
	end)

	return [[<settings>]] .. settings .. [[</settings>]]
end

XML_STRING = [[<configuration name="event_socket.conf" description="Event Socket Server">]] ..
                build_event_socket_conf(event) .. [[</configuration>]]

