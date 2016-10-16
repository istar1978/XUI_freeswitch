#!/usr/bin/env ruby
# encoding: utf-8

HOST="http://127.0.0.1:8081"

require 'rubygems'
require 'rest-client'
require 'json'

puts RestClient.get("#{HOST}/api/channels")

# data = {:destNumber => "1007"}
# data = {:destNumber => "1007", :app => "speak", :args => "你好"}
# data = {:destNumber => "1007", :app => "say", :args => "zh NUMBER ITERATED 1234"}
# data = {:destNumber => "1007", :apps => [
# 	{:app => "speak", :args => "你好"},
# 	{:app => "say", :args => "zh NUMBER ITERATED 1234"}
# ]}

data = {:destNumber => "1007",
	:cidNumber => "8888",
	:autoAnswer => "true",
	:async => "true",
	:callback_url => "localhost:7777/blah",
	:apps => [
	{:app => "speak", :args => "您好，您的验证码是"},
	# {:app => "playback", :args => "/tmp/ssss.wav"},
	{:app => "say_number", :args => "1234"}
]}

puts data.to_json

puts RestClient.post("#{HOST}/api/channels", data.to_json,
	{:accept => 'application/json', :content_type => "application/json"})
