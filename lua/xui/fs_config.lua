-- do_debug = true

section =   XML_REQUEST["section"]
tag_name =  XML_REQUEST["tag_name"]
key_name =  XML_REQUEST["key_name"]
key_value = XML_REQUEST["key_value"]

if do_debug then
	print("section: " .. section)
	print("tag_name: " .. tag_name)
	print("key_name: " .. key_name)
	print("key_value: " .. key_value)
	if params then print(params:serialize()) end
end


local cur_dir = debug.getinfo(1).source;
cur_dir = string.gsub(debug.getinfo(1).source, "^@(.+/)[^/]+$", "%1")

package.path = package.path .. ";" .. cur_dir .. "?.lua"
package.path = package.path .. ";" .. cur_dir .. "fsxml/" .. tag_name .. "/?.lua"

require 'utils'
require 'xtra_config'
require 'xdb'

if config.db_auto_connect then xdb.connect(config.dsn) end

pkg = cur_dir .. "fsxml/" .. tag_name .. "/" .. key_value .. ".lua"
-- print(pkg)

f, e = loadfile(pkg)
if f then
	f()
	if XML_STRING then
		XML_STRING = [[
			<document type="freeswitch/xml">
				<section name="configuration">
					<configuration name="]] .. key_value .. '">' ..
						XML_STRING .. [[
					</configuration>
				</section>
			</document>
		]]
	else
		XML_STRING = "<xml></xml>"
	end

	if do_debug then print(XML_STRING) end
else
	if not e:match("No such file") then
		freeswitch.consoleLog("ERR", e .. "\n")
	end
	XML_STRING = "<xml></xml>"
end
