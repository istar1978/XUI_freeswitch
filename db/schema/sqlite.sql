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
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE INDEX routes_deleted_epoch ON routes(deleted_epoch);

CREATE TRIGGER tg_routes AFTER UPDATE ON routes
BEGIN
	UPDATE routes set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

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
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE UNIQUE INDEX users_extn ON users(domain, extn);
CREATE INDEX users_deleted_epoch ON users(deleted_epoch);

CREATE TRIGGER tg_users AFTER UPDATE ON users
BEGIN
	UPDATE users set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE blocks (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
	description VARCHAR,
	ver TEXT,
	xml TEXT,
	js TEXT,
	lua TEXT,
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE INDEX blocks_deleted_epoch ON blocks(deleted_epoch);

CREATE TRIGGER tg_blocks AFTER UPDATE ON blocks
BEGIN
	UPDATE blocks set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE dicts (
	id INTEGER PRIMARY KEY,
	realm VARCHAR NOT NULL,
	k VARCHAR NOT NULL, -- key
	v VARCHAR, -- value
	d VARCHAR, -- description
	o INTEGER, -- order
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE INDEX dicts_realm ON dicts(realm);
CREATE INDEX dicts_k ON dicts(k);
CREATE UNIQUE INDEX dicts_realm_k ON dicts(realm, k);

CREATE TRIGGER tg_dicts AFTER UPDATE ON dicts
BEGIN
	UPDATE dicts set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE groups (
	id INTEGER PRIMARY KEY,
	realm VARCHAR NOT NULL,           -- a key in dicts
	name VARCHAR NOT NULL,
	description VARCHAR,
	group_id INTEGER,        -- nested groups
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE INDEX groups_deleted_epoch ON groups(deleted_epoch);

CREATE TRIGGER tg_groups AFTER UPDATE ON groups
BEGIN
	UPDATE groups set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE user_groups (
	id INTEGER PRIMARY KEY,
	user_id INTEGER NOT NULL,
	group_id INTEGER NOT NULL,
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE INDEX user_group_u_g_id ON user_groups(user_id, group_id);

CREATE TRIGGER tg_user_group AFTER UPDATE ON user_groups
BEGIN
	UPDATE user_groups set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE extn_groups (
	id INTEGER PRIMARY KEY,
	user_id INTEGER NOT NULL,
	group_id INTEGER NOT NULL,
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE INDEX extn_group_e_g_id ON extn_groups(user_id, group_id);

CREATE TRIGGER tg_extn_groups AFTER UPDATE ON extn_groups
BEGIN
	UPDATE extn_groups set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE gateways (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
	realm VARCHAR NOT NULL,
	username VARCHAR,
	password VARCHAR,
	register VARCHAR NOT NULL DEFAULT 'true',
	description VARCHAR,
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE INDEX gateways_name ON gateways(name);
CREATE INDEX gateways_deleted_epoch ON gateways(deleted_epoch);

CREATE TRIGGER tg_gateways AFTER UPDATE ON gateways
BEGIN
	UPDATE gateways set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE params (
	id INTEGER PRIMARY KEY,
	realm VARCHAR NOT NULL, -- e.g. sip_profiles or gateways
	k VARCHAR NOT NULL,
	v VARCHAR,
	ref_id INTEGER,-- e.g. sip_profiles.id or gateway.id
	disabled BOOLEAN NOT NULL DEFAULT 0 CHECK(disabled IN (0, 1, '0', '1')),
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE INDEX params_realm ON params(realm);
CREATE INDEX params_rrk ON params(realm, ref_id, k);
CREATE INDEX params_deleted_epoch ON params(deleted_epoch);

CREATE TRIGGER tg_params AFTER UPDATE ON params
BEGIN
	UPDATE params set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE sip_profiles (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
	description VARCHAR,
	disabled BOOLEAN NOT NULL DEFAULT 0 CHECK(disabled IN (0, 1, '0', '1')),
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE UNIQUE INDEX sip_profiles_name ON sip_profiles(name);
CREATE INDEX sip_profiles_deleted_epoch ON sip_profiles(deleted_epoch);

CREATE TRIGGER tg_sip_profiles AFTER UPDATE ON sip_profiles
BEGIN
	UPDATE sip_profiles set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;


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
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE INDEX media_files_created_epoch ON media_files(created_epoch);
CREATE INDEX media_files_type ON media_files(type);

CREATE TRIGGER tg_media_files AFTER UPDATE ON media_files
BEGIN
	UPDATE media_files set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE conference_rooms (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	description VARCHAR,
	nbr VARCHAR,  -- conference number
	capacity integer,
	realm VARCHAR,
	pin VARCHAR,

	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE TRIGGER tg_conference_rooms AFTER UPDATE ON conference_rooms
BEGIN
	UPDATE conference_rooms set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE devices (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	type VARCHAR,
	vendor VARCHAR,
	mac VARCHAR,

	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE TRIGGER tg_devices AFTER UPDATE ON devices
BEGIN
	UPDATE devices set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE user_devices (
	id INTEGER PRIMARY KEY,
	user_id INTEGER NOT NULL,
	mac_id VARCHAR NOT NULL,

	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE TRIGGER tg_user_devices AFTER UPDATE ON user_devices
BEGIN
	UPDATE user_devices set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TABLE fifo_cdrs (
	id INTEGER PRIMARY KEY,
	channel_uuid VARCHAR NOT NULL,
	fifo_name VARCHAR NOT NULL,
	ani VARCHAR,                -- the original caller id number
	dest_number VARCHAR,        -- the original dest number
	bridged_number VARCHAR,     -- bridged_number
	media_file_id INTEGER,
	
	start_epoch INTEGER,
	bridge_epoch INTEGER,
	end_epoch INTEGER
);

CREATE INDEX fifo_cdrs_start_epoch ON fifo_cdrs(start_epoch);
CREATE INDEX fifo_cdrs_channel_uuid ON fifo_cdrs(channel_uuid);


CREATE TABLE fifos (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
	description VARCHAR,
	importance INTEGER DEFAULT 0,
	outbound_per_cycle INTEGER,
	outbound_per_cycle_min INTEGER

	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE TRIGGER tg_fifos AFTER UPDATE ON fifos
BEGIN
	UPDATE fifos set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE INDEX fifo_name ON fifos(name);



CREATE TABLE fifo_members (
	id INTEGER PRIMARY KEY,
	fifo_id INTEGER,
	name VARCHAR,
	description VARCHAR,
	fifo_name VARCHAR,
	timeout INTEGER DEFAULT 60,
	simo INTEGER DEFAULT 1,
	lag INTEGER DEFAULT 2,
	extn VARCHAR,
	dial_string VARCHAR,

	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE TRIGGER tg_fifo_members AFTER UPDATE ON fifo_members
BEGIN
	UPDATE fifo_members set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE INDEX fifo_member_fifo_name ON fifo_members(fifo_name);

CREATE TABLE mcasts (
	id INTEGER PRIMARY KEY,
	name VARCHAR NOT NULL,
	source VARCHAR,
	codec_name VARCHAR,
	codec_ms INTEGER,
	channels VARCHAR DEFAULT '1',
	maddress VARCHAR,
	mport VARCHAR,
	sample_rate VARCHAR,
	enable BOOLEAN,
	created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
	deleted_epoch INTEGER
);

CREATE UNIQUE INDEX mcasts_name ON mcasts(name);
CREATE UNIQUE INDEX mcasts_maddress_mport ON mcasts(maddress, mport);

CREATE INDEX mcasts_deleted_epoch ON mcasts(deleted_epoch);

CREATE TRIGGER tg_mcasts AFTER UPDATE ON mcasts
BEGIN
	UPDATE mcasts set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

-- END
