-- 1.1
CREATE TRIGGER tg_routes AFTER UPDATE ON routes
BEGIN
	UPDATE routes set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER tg_users AFTER UPDATE ON users
BEGIN
	UPDATE users set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER tg_dicts AFTER UPDATE ON dicts
BEGIN
	UPDATE dicts set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER tg_groups AFTER UPDATE ON groups
BEGIN
	UPDATE groups set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

DROP TABLE user_groups;
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

DROP TABLE extn_groups;
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

CREATE TRIGGER tg_gateways AFTER UPDATE ON gateways
BEGIN
	UPDATE gateways set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER tg_params AFTER UPDATE ON params
BEGIN
	UPDATE params set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER tg_sip_profiles AFTER UPDATE ON sip_profiles
BEGIN
	UPDATE sip_profiles set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER tg_media_files AFTER UPDATE ON media_files
BEGIN
	UPDATE media_files set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER tg_conference_rooms AFTER UPDATE ON conference_rooms
BEGIN
	UPDATE conference_rooms set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;


AlTER TABLE	devices add created_epoch INTEGER DEFAULT (DATETIME('now', 'localtime'));
AlTER TABLE	devices add updated_epoch INTEGER DEFAULT (DATETIME('now', 'localtime')),
AlTER TABLE	devices add deleted_epoch INTEGER;

CREATE TRIGGER tg_devices AFTER UPDATE ON devices
BEGIN
	UPDATE devices set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER tg_user_devices AFTER UPDATE ON user_devices
BEGIN
	UPDATE user_devices set updated_epoch = DATETIME('now', 'localtime') WHERE id = NEW.id;
END;

ALTER TABLE conference_rooms add pin VARCHAR;
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'FS_DEST_CONFERENCE', 'CONFERENCE');

UPDATE params set disabled = 0 WHERE realm = 'modules' AND k = 'mod_cdr_sqlite';
UPDATE params set disabled = 0 WHERE realm = 'modules' AND k = 'mod_local_stream';

UPDATE dicts SET v = '1.1' WHERE realm = 'XUI' and k = 'VER';
UPDATE dicts SET v = '1.1' WHERE realm = 'XUI' and k = 'DBVER';
