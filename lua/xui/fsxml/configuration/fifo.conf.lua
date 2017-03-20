
function build_members(fifo_id)
	member = ""
	xdb.find_by_cond("fifo_members", {fifo_id = fifo_id}, id, function(row)
		if row.dial_string == "" then
			dial_string = [[{fifo_member_wait = nowait,fifo_record_template = $${base_dir}/recordings/]] .. "fifo-record-" .. '$${strftime(%Y%m%d-%H%M%S)}' .. "-" .. '${create_uuid()}' .. '.mp3' .. [[}]] .. [[user/]] .. row.extn			
		else
			dial_string = row.dial_string
		end

		member = member .. [[<member timeout="]] .. row.timeout .. [[" simo="]] ..
			row.simo .. [[" lag="]] .. row.lag .. [[">]] .. dial_string .. '@$${domain}' .. [[</member>]] .. "\n"
	end)
	return member
end

function build_fifos()
	local fifos = ""

	xdb.find_all("fifos", 'id', function(row)
		fifos = fifos .. '<fifo name="' .. row.name .. '" importance="' .. row.importance .. [[">]] ..
			build_members(row.id) .. '</fifo>\n'
	end)

	return fifos
end

xXML_STRING=[[
<configuration name="fifo.conf" description="FIFO Configuration">
<settings>
	<param name="delete-all-outbound-member-on-startup" value="false"/>
	<param name="outbound-strategy" value="ringall"/>
	<param name="outbound_per_cycle" value="6"/>
</settings>
<fifos> ]] ..
	build_fifos() ..
	[[

    <fifo name="test" importance="0">
      <member timeout="60" simo="2" lag="2">{member_wait=nowait,fifo_record_template=/tmp/a-${uuid}-$caller_id_name-$uuid.wav}sofia/public/807@192.168.3.30:5080</member>
      <member timeout="60" simo="2" lag="2">{member_wait=nowait,fifo_record_template=/tmp/a-${uuid}.wav}sofia/public/819@192.168.3.30:5080</member>
    </fifo>


	</fifos>
</configuration>
]]
