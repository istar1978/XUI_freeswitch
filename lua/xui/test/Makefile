HOST=localhost:8080
PATH=/rest/

all:
	echo all

rest:
	curl -vv ${HOST}${PATH}

post:
	curl -vv -XPOST ${HOST}${PATH}

put:
	curl -vv -XPUT ${HOST}${PATH}index/aa/bb/cc/dd

delete:
	curl -vv -XDELETE ${HOST}${PATH}dialer
#	curl -vv -XDELETE ${HOST}${PATH}sendfile/20140902-bfb10b9a-72c6-46b0-8a83-6cb065ce5a0f

send:
	curl -vvvvvv -XPOST -H "Content-Type: application/octet-stream" -H "X-IM-Filename: x.txt" --data-binary @../function.lua localhost:8080/rest/sendfile
