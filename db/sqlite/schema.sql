CREATE TABLE contexts (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	data TEXT
);


CREATE TABLE routings (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	description VARCHAR,
	prefix VARCHAR,
	length, INTEGER,
	context VARCHAR,
	dnc VARCHAR,
	sdnc VARCHAR,
	dest_type VARCHAR,
	dest_uuid VARCHAR,
	body TEXT
);

CREATE TABLE profiles (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	data TEXT
);

CREATE TABLE gateways (
	id INTEGER PRIMARY KEY,
	profile_id INTEGER,
	name VARCHAR,
	data TEXT
);
