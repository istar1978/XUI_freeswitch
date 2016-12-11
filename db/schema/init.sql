-- XUI init data

-- Create the first user

INSERT INTO users (extn, name, password) VALUES ('admin', 'Admin', 'admin');

-- all reamls should have an entry
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'XUI', 'XUI');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'GLOBAL', 'GLOBAL');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'USERTYPE', 'USERTYPE');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'CONTEXT', 'CONTEXT');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'DEST', 'DEST');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'GROUP', 'GROUP');

-- k,v to each realm
INSERT INTO dicts (realm, k, v) VALUES ('XUI', 'NAME', 'XUI');
INSERT INTO dicts (realm, k, v) VALUES ('XUI', 'VER', '1.0');
INSERT INTO dicts (realm, k, v) VALUES ('XUI', 'DBVER', '1.0');

INSERT INTO dicts (realm, k, v) VALUES ('GLOBAL', 'default_password', '1234');
INSERT INTO dicts (realm, k, v) VALUES ('GLOBAL', 'domain', 'xui');
INSERT INTO dicts (realm, k, v) VALUES ('GLOBAL', 'domain_name', 'xui');

INSERT INTO dicts (realm, k, v) VALUES ('USERTYPE', 'FS_UT_SIP', 'SIP');
INSERT INTO dicts (realm, k, v) VALUES ('USERTYPE', 'FS_UT_TDM', 'TDM');
INSERT INTO dicts (realm, k, v) VALUES ('USERTYPE', 'FS_UT_VERTO', 'VERTO');

INSERT INTO dicts (realm, k, v) VALUES ('CONTEXT', 'default', 'default');
INSERT INTO dicts (realm, k, v) VALUES ('CONTEXT', 'public',  'public' );

INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'FS_DEST_USER', 'USER');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'FS_DEST_SYSTEM', 'SYSTEM');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'FS_DEST_IVRBLOCK', 'IVRBLOCK');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'FS_DEST_GATEWAY', 'GATEWAY');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'FS_DEST_USERGW', 'USERGW');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'FS_DEST_IP', 'IP');

INSERT INTO dicts (realm, k, v) VALUES ('GROUP', 'FS_GRP_USER', 'User Group');
INSERT INTO dicts (realm, k, v) VALUES ('GROUP', 'FS_GRP_EXTN', 'Extn Group');
INSERT INTO dicts (realm, k, v) VALUES ('GROUP', 'FS_GRP_IVRB', 'IVR Block Group');
INSERT INTO dicts (realm, k, v) VALUES ('GROUP', 'FS_GRP_IVR', 'IVR Group');

-- END
