#!/usr/bin/env ruby

HOST="http://127.0.0.1:8081"
URL="#{HOST}/api/routings"

require 'rubygems'
require 'json'
require 'rest-client'

1000.upto(1000) do |i|

	data = {:routing => {
		:prefix => i.to_s,
		:dest_type => "GATEWAY",
		:dest_data => "gw1",
		:context => "3"}
	}
	puts data.to_json

	puts RestClient.post(URL, data.to_json, {:content_type => "application/json"})

end

i = 2000

data = {:routing => { :prefix => i.to_s, :dest_type => "IP", :dest_data => "127.0.0.1:5080", :context => "3"} }
puts data.to_json
puts RestClient.post(URL, data.to_json, {:content_type => "application/json"})

i = 2001

data = {:routing => { :prefix => i.to_s, :dest_type => "SYSTEM", :body => "answer\r\nlog ERR blah\r\necho\r\n", :context => "3"} }
puts data.to_json
puts RestClient.post(URL, data.to_json, {:content_type => "application/json"})
