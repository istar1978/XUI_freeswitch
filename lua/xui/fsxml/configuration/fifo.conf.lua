
function build_members(fifo_id)
	member = ""
	xdb.find_by_cond("fifo_members", {fifo_id = fifo_id}, id, function(row)

		if not row.dial_string == "" then
			dial_string = row.dial_string
		else
			dial_string = "user/" .. row.extn
		end

		member = member .. [[<member timeout="]] .. row.timeout .. [[" simo="]] ..
			row.simo .. [[" lag="]] .. row.lag .. [[">]] .. dial_string .. [[</member>]] .. "\n"
	end)
	return member
end

function build_fifos()
	local fifos = ""

	xdb.find_all("fifos", 'id', function(row)
		fifos = fifos .. '<fifo name="' .. row.name .. '@$${domain}" importance="' .. row.importance .. [[">]] ..
			build_members(row.id) .. '</fifo>\n'
	end)

	return fifos
end

XML_STRING=[[
<configuration name="fifo.conf" description="FIFO Configuration">
<settings>
	<param name="delete-all-outbound-member-on-startup" value="false"/>
	<param name="outbound-strategy" value="ringall"/>
	<param name="outbound_per_cycle" value="2"/>
</settings>
<fifos> ]] ..
	build_fifos() ..
	[[</fifos>
</configuration>
]]
