tts_engine = "tts_commandline"
tts_voice = "Ting-Ting"
session:set_tts_params(tts_engine, tts_voice)
session:setVariable("tts_engine", tts_engine)
session:setVariable("tts_voice", tts_voice)
session:answer()
local recording_dir = '/xui/www/ticket-record'

local cid_number=session:getVariable("caller_id_number")
local time=os.date("%Y-%m-%d-%H-%M-%S")
local recording_filename = string.format('%s/record-%s-%s.mp3', recording_dir, time, cid_number)
freeswitch.consoleLog("err", recording_filename .. "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
local dbh=freeswitch.Dbh("sqlite://xui")
assert(dbh:connected())
local sql = "insert into tickets(cid_number,status,record_path) values('" .. cid_number .. "', 1, '" .. 'ticket-record/record-' .. time .. '-' .. cid_number ..".mp3')";
dbh:query(sql,function(row)
	session:consoleLog("ERR",row.name)
end)
session:execute("record_session", recording_filename)
session:execute("fifo", 'default in')
