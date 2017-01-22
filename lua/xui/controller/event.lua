content_type("application/json")
require 'xdb'
xdb.bind(xtra.dbh)
require 'm_events'

get('/', function(params)
        n, events = m_events.find_all()

        if (n > 0) then
                return events
        else
                return "[]"
        end
end)


