CREATE TABLE routes (
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

CREATE TABLE users (
	id INTEGER PRIMARY KEY,
	extn VARCHAR,
	name VARCHAR,
	cid_number VARCHAR,
	cid_name VARCHAR,
	context VARCHAR,
	domain VARCHAR,
	password VARCHAR,
	vm_password VARCHAR,
	type VARCHAR,
	disabled VARCHAR
);

INSERT INTO users (extn, name, password) VALUES ('admin', 'Admin', 'admin');

CREATE TABLE blocks (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	description VARCHAR,
	created_at_epoch INTEGER,
	xml TEXT,
	js TEXT,
	lua TEXT
);
