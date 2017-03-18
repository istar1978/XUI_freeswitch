function build_mcasts()
	local mcasts = ""

	xdb.find_by_cond("mcasts", nil, "id", function(row)
		local p = '<param name="source"' .. ' value="' .. row.source .. '"/>'
		p = p .. '<param name="codec-name"' .. ' value="' .. row.codec_name .. '"/>'
		p = p .. '<param name="sample-rate"' .. ' value="' .. row.sample_rate .. '"/>'
		p = p .. '<param name="codec-ms"' .. ' value="' .. row.codec_ms .. '"/>'
		p = p .. '<param name="channels"' .. ' value="' .. row.channels .. '"/>'
		p = p .. '<param name="mcast-ip"' .. ' value="' .. row.mcast_ip .. '"/>'
		p = p .. '<param name="mcast-port"' .. ' value="' .. row.mcast_port .. '"/>'
		p = p .. '<param name="enable"' .. ' value="' .. row.enable .. '"/>'

		local mcast = '<mcast name="' .. row.name .. '">' .. p .. '</mcast>'

		mcasts = mcasts .. mcast
	end)

	return mcasts
end


mcasts = build_mcasts()
XML_STRING = [[<configuration name="rtp_mcast.conf" description="rtp mcast">]] .. mcasts .. [[</configuration>]]
