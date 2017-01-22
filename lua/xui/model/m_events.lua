require 'xdb'
xdb.bind(xtra.dbh)

m_event = {}

function find_all()
	return xdb.find_by_cond('params', {realm = 'event'})
end

m_event.find_all = find_all

return m_event
