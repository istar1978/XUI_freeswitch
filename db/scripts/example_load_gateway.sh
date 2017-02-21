#!/bin/bash

i=4
while IFS='' read -r line || [[ -n "$line" ]]; do
	# echo "Text read from file: $line"
	user=$(echo $line | cut -f1 -d ' ')
	pass=$(echo $line | cut -f2 -d ' ')
	echo "INSERT INTO gateways (name, realm, username, password) VALUES ('$user', 'ims.gx.chinamobile.com', '+86$user', '$pass');"
	echo "INSERT INTO params (realm, k, v, ref_id, disabled) SELECT 'gateway', k, v, $i, disabled FROM params where realm = 'gateway' and ref_id = 3;"
	echo "UPDATE params set v = '+86$user' WHERE ref_id = $i and realm = 'gateway' and k = 'from-user';"
	echo "UPDATE params set v = '+86$user@ims.gx.chinamobile.com' WHERE ref_id = $i and realm = 'gateway' and k = 'auth-username';"
	i=`expr $i + 1`
done < "$1"

