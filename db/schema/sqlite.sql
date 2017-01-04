-- XUI tables

CREATE TABLE routes (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
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

CREATE INDEX routes_deleted_epoch ON routes(deleted_epoch);

CREATE TABLE users (
	id INTEGER PRIMARY KEY,
	extn VARCHAR,
	name VARCHAR NOT NULL,
	cid_number VARCHAR,
	cid_name VARCHAR,
	context VARCHAR,
	domain VARCHAR,
	password VARCHAR,
	vm_password VARCHAR,
	user_cidr VARCHAR,
	type VARCHAR,
	disabled VARCHAR,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE UNIQUE INDEX users_extn ON users(domain, extn);
CREATE INDEX users_deleted_epoch ON users(deleted_epoch);

CREATE TABLE blocks (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
	description VARCHAR,
	ver TEXT,
	xml TEXT,
	js TEXT,
	lua TEXT,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX blocks_deleted_epoch ON blocks(deleted_epoch);

CREATE TABLE dicts (
	id INTEGER PRIMARY KEY,
	realm VARCHAR NOT NULL,
	k VARCHAR NOT NULL, -- key
	v VARCHAR, -- value
	d VARCHAR, -- description
	o INTEGER, -- order
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX dicts_realm ON dicts(realm);
CREATE INDEX dicts_k ON dicts(k);
CREATE UNIQUE INDEX dicts_realm_k ON dicts(realm, k);

CREATE TABLE groups (
	id INTEGER PRIMARY KEY,
	realm VARCHAR NOT NULL,           -- a key in dicts
	name VARCHAR NOT NULL,
	description VARCHAR,
	group_id INTEGER,        -- nested groups
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX groups_deleted_epoch ON groups(deleted_epoch);

CREATE TABLE user_group (
	id INTEGER PRIMARY KEY,
	user_id INTEGER NOT NULL,
	group_id INTEGER NOT NULL,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX user_group_u_g_id ON user_group(user_id, group_id);

CREATE TABLE extn_group (
	id INTEGER PRIMARY KEY,
	user_id INTEGER NOT NULL,
	group_id INTEGER NOT NULL,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX extn_group_e_g_id ON user_group(user_id, group_id);

CREATE TABLE gateways (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
	realm VARCHAR NOT NULL,
	username VARCHAR,
	password VARCHAR,
	register VARCHAR NOT NULL DEFAULT 'true',
	description VARCHAR,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX gateways_name ON gateways(name);
CREATE INDEX gateways_deleted_epoch ON gateways(deleted_epoch);

CREATE TABLE params (
	id INTEGER PRIMARY KEY,
	realm VARCHAR NOT NULL, -- e.g. sip_profiles or gateways
	k VARCHAR NOT NULL,
	v VARCHAR,
	ref_id INTEGER,-- e.g. sip_profiles.id or gateway.id
	disabled BOOLEAN NOT NULL DEFAULT 0 CHECK(disabled IN (0, 1, '0', '1')),
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX params_realm ON params(realm);
CREATE INDEX params_rrk ON params(realm, ref_id, k);
CREATE INDEX params_deleted_epoch ON params(deleted_epoch);

CREATE TABLE sip_profiles (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
	description VARCHAR,
	disabled BOOLEAN NOT NULL DEFAULT 0 CHECK(disabled IN (0, 1, '0', '1')),
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE UNIQUE INDEX sip_profiles_name ON sip_profiles(name);
CREATE INDEX sip_profiles_deleted_epoch ON sip_profiles(deleted_epoch);


CREATE TABLE media_files(
	id INTEGER PRIMARY KEY,
	type VARCHAR,          -- FAX, PDF, AUDIO, VIDEO, AUDIO-CONF, VIDEO-CONF
	name VARCHAR NOT NULL,
	description VARCHAR,
	file_name VARCHAR,
	ext VARCHAR,
	mime VARCHAR,
	file_size INTEGER,
	channels INTEGER,
	sample_rate INTEGER,
	bit_rate INTEGER,
	duration INTEGER,
	original_file_name VARCHAR,
	dir_path VARCHAR, -- dir
	abs_path VARCHAR, -- absolute path
	rel_path VARCHAR, -- relative path
	thumb_path VARCHAR,
	meta TEXT,
	geo_position VARCHAR,
	user_id INTEGER,
	channel_uuid VARCHAR,
	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);

CREATE INDEX media_files_created_epoch ON media_files(created_epoch);
CREATE INDEX media_files_type ON media_files(type);

CREATE TABLE conference_rooms (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	description VARCHAR,
	nbr VARCHAR,  -- conference number
	capacity integer,
	realm VARCHAR,

	created_epoch INTEGER,
	updated_epoch INTEGER,
	deleted_epoch INTEGER
);


-- END
