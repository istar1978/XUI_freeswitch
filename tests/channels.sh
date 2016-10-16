#!/bin/bash

HOST=http://127.0.0.1:8081

curl -vv $HOST/api/channels

curl -vv -XPOST -H "Content-Type: application/json" -d '{"destNumber": "1007"}' $HOST/api/channels
