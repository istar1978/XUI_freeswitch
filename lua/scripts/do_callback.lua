api = freeswitch.API()

api:execute("log", "ERR callback")
api:execute("log", "ERR callback" .. session:get_uuid())
api:execute("log", "ERR callback" .. session:getVariable("caller_id_number"))
