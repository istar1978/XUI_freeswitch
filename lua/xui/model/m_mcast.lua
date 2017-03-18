require 'xdb'
xdb.bind(xtra.dbh)

m_mcast = {}

function m_mcast.toggle(mcast_id)
	sql = "UPDATE mcasts SET enable = NOT enable " ..
		xdb.cond({id = mcast_id})
	print(sql)

	xdb.execute(sql)
	if xdb.affected_rows() == 1 then
		return xdb.find("mcasts", mcast_id)
	end
	return nil
end

return m_mcast