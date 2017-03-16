#!/usr/bin/env ruby
# encoding: utf-8

HOST="http://192.168.3.69:8081"

require 'rubygems'
require 'rest-client'
require 'json'

 puts RestClient.get("#{HOST}/api/fifos")
 puts RestClient.get("#{HOST}/api/fifo_members")

# data = {:destNumber => "1007"}
# data = {:destNumber => "1007", :app => "speak", :args => "你好"}
# data = {:destNumber => "1007", :app => "say", :args => "zh NUMBER ITERATED 1234"}
# data = {:destNumber => "1007", :apps => [
# 	{:app => "speak", :args => "你好"},
# 	{:app => "say", :args => "zh NUMBER ITERATED 1234"}
# ]}

data1 = {:id => "7",
      	:name => "default",
      	:description => "good",
      	:importance => "1",
}

data2 = {:id => "7",
        :fifo_id => "7",
        :name => "1005",
        :description => "good",
        :fifo_name => "default",
        :timeout => "60",
        :simo => "1",
        :lag => "2",
        :extn => "1005",
        :dial_string => "",

}

puts data1.to_json
puts data2.to_json


puts RestClient.post("#{HOST}/api/fifos", data1.to_json,
	{:accept => 'application/json', :content_type => "application/json"})

puts RestClient.post("#{HOST}/api/fifo_members", data2.to_json,
        {:accept => 'application/json', :content_type => "application/json"})

