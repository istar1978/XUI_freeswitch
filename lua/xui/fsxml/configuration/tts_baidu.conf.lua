local n, rows = xdb.find_by_cond("dicts", {realm = 'BAIDU'})

if n > 0 then
	params = {}
	for k,row in pairs(rows) do
		print(row.k)
		print(row.v)
		params[row.k] = row.v
	end

	XML_STRING = [[<configuration name="tts_baidu.conf" description="TextToSpeech configuration">
	<settings>
	<param name="token-url" value="https://openapi.baidu.com/oauth/2.0/token"/>
	<param name="tts-url" value="http://tsn.baidu.com/text2audio"/>
	<param name="tts-file-ext" value="mp3"/>
	<param name="api-key" value="]] .. params.APPKEY .. [["/>
	<param name="secret-key" value="]].. params.SECKEY .. [["/>
	<param name="grant-type" value="client_credentials"/>
	<param name="token-expires" value="180"/>  <!-- default value -->
	<param name="user-id" value="3c:15:c2:da:da:dc"/>  <!-- mac addr or IEMI -->
	<param name="token-cache" value="true"/>
	<param name="speed" value="5"/>  <!-- 0-9 -->
	<param name="volume" value="5"/>  <!-- 0-9 -->
	<param name="pitch" value="5"/>  <!-- 0-9 -->
	<param name="person" value="0"/>  <!-- 0-1 -->
	<param name="curl-timeout" value="2"/>
	<param name="curl-connect-timeout" value="2"/>
	</settings>
	</configuration>]]
end