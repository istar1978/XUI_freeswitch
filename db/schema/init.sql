-- XUI init data

-- Create the first user

INSERT INTO users (extn, name, password) VALUES ('admin', 'Admin', 'admin');

-- all reamls should have an entry
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'XUI', 'XUI');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'GLOBALS', 'GLOBALS');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'USERTYPES', 'USERTYPES');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'CONTEXTS', 'CONTEXTS');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'DESTS', 'DESTS');
INSERT INTO dicts (realm, k, v) VALUES ('REALMS', 'GROUPS', 'GROUPS');

-- k,v to each realm
INSERT INTO dicts (realm, k, v) VALUES ('XUI', 'NAME', 'XUI');
INSERT INTO dicts (realm, k, v) VALUES ('XUI', 'VER', '1.0');
INSERT INTO dicts (realm, k, v) VALUES ('XUI', 'DBVER', '1.0');

INSERT INTO dicts (realm, k, v) VALUES ('GLOBALS', 'default_password', '1234');
INSERT INTO dicts (realm, k, v) VALUES ('GLOBALS', 'domain', 'xui');
INSERT INTO dicts (realm, k, v) VALUES ('GLOBALS', 'domain_name', 'xui');

INSERT INTO dicts (realm, k, v) VALUES ('USERTYPE', 'SIP', 'SIP');
INSERT INTO dicts (realm, k, v) VALUES ('USERTYPE', 'TDM', 'TDM');
INSERT INTO dicts (realm, k, v) VALUES ('USERTYPE', 'VERTO', 'VERTO');

INSERT INTO dicts (realm, k, v) VALUES ('CONTEXT', 'default', 'default');
INSERT INTO dicts (realm, k, v) VALUES ('CONTEXT', 'public',  'public' );

INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'USER', 'USER');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'SYSTEM', 'SYSTEM');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'IVRBLOCK', 'IVRBLOCK');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'GATEWAY', 'GATEWAY');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'USERGW', 'USERGW');
INSERT INTO dicts (realm, k, v) VALUES ('DEST', 'IP', 'IP');

INSERT INTO dicts (realm, k, v) VALUES ('GROUP', 'USER', 'User Group');
INSERT INTO dicts (realm, k, v) VALUES ('GROUP', 'EXTN', 'Extn Group');
INSERT INTO dicts (realm, k, v) VALUES ('GROUP', 'IVRB', 'IVR Block Group');
INSERT INTO dicts (realm, k, v) VALUES ('GROUP', 'IVR', 'IVR Group');

-- END
