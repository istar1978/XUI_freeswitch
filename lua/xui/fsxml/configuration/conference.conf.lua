function build_conference_conf(conference)
	local settings = ""
	local cond = {realm = 'conference', disabled = 0}

	xdb.find_by_cond("params", cond, 'id', function (row)
		settings = settings .. '<param name ="' .. row.k .. '" value="' .. row.v .. '"/>'
	end)

return [[<settings>]] .. settings .. [[</settings>]]
end

XML_STRING = [[<configuration name="conference.conf" description="Conference Server">
		<caller-controls>
			<group name="default">
			<control action="mute" digits="0"/>
			<control action="deaf mute" digits="**"/>
			<control action="vmute" digits="*0"/>
			<control action="vmute snap" digits="*1"/>
			<control action="vmute snapoff" digits="*2"/>
			<control action="mute on" digits="*4"/>
			<control action="mute off" digits="*5"/>
			<control action="energy up" digits="9"/>
			<control action="energy equ" digits="8"/>
			<control action="energy dn" digits="7"/>
			<control action="vol talk up" digits="3"/>
			<control action="vol talk zero" digits="2"/>
			<control action="vol talk dn" digits="1"/>
			<control action="vol listen up" digits="6"/>
			<control action="vol listen zero" digits="5"/>
			<control action="vol listen dn" digits="4"/>
			<control action="hangup" digits="#"/>
			</group>
		</caller-controls>
		]] .. build_conference_conf(conference) ..
		[[</configuration>]]

XML_STRING = nil
