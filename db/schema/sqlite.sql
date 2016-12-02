-- XUI tables

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
	body TEXT,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX routes_deleted_epoch on routes(deleted_epoch);

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
	disabled VARCHAR,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE UNIQUE INDEX users_extn on users(domain, extn);
CREATE INDEX users_deleted_epoch on users(deleted_epoch);

CREATE TABLE blocks (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	description VARCHAR,
	xml TEXT,
	js TEXT,
	lua TEXT,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX blocks_deleted_epoch on blocks(deleted_epoch);

CREATE TABLE dicts (
	id INTEGER PRIMARY KEY,
	realm VARCHAR,
	k VARCHAR, -- key
	v VARCHAR, -- value
	d VARCHAR, -- description
	o INTEGER, -- order
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX dicts_realm on dicts(realm);
CREATE INDEX dicts_k on dicts(k);
CREATE UNIQUE INDEX dicts_realm_k on dicts(realm, k);

CREATE TABLE groups (
	id INTEGER PRIMARY KEY,
	realm VARCHAR,           -- a key in dicts
	name VARCHAR,
	description VARCHAR,
	group_id INTEGER,        -- nested groups
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX groups_deleted_epoch on groups(deleted_epoch);

CREATE TABLE user_group (
	id INTEGER PRIMARY KEY,
	user_id INTEGER,
	group_id INTEGER,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX user_group_u_g_id on user_group(user_id, group_id);

CREATE TABLE extn_group (
	id INTEGER PRIMARY KEY,
	user_id INTEGER,
	group_id INTEGER,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX extn_group_e_g_id on user_group(user_id, group_id);

CREATE TABLE gateways (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	realm VARCHAR,
	username VARCHAR,
	password VARCHAR,
	register BOOLEAN,
	description VARCHAR,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX gateways_name on gateways(name);
CREATE INDEX gateways_deleted_epoch on gateways(deleted_epoch);

CREATE TABLE params (
	id INTEGER PRIMARY KEY,
	realm VARCHAR, -- e.g. sip_profiles or gateways
	k VARCHAR,
	v VARCHAR,
	ref_id INTEGER,-- e.g. sip_profiles.id or gateway.id
	disabled BOOLEAN,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX params_realm on params(realm);
CREATE INDEX params_rrk on params(realm, ref_id, k);
CREATE INDEX params_deleted_epoch on params(deleted_epoch);

CREATE TABLE sip_profiles (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	description VARCHAR,
	disabled BOOLEAN,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE UNIQUE INDEX sip_profiles_name on sip_profiles(name);
CREATE INDEX sip_profiles_deleted_epoch on sip_profiles(deleted_epoch);


-- END
