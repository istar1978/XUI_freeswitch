#!/bin/bash

HOST=localhost:8080
URI=$HOST/rest


case $1 in
	"channel")
		curl -vv -XPUT -d "channel_uuid=uuid&action=reject" $URI/channel
		;;
	"channeluuid")
		curl -vv -XPUT -d "action=reject" $URI/channel/uuid
		;;
esac
