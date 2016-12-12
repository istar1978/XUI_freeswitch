INSERT INTO routes (name, description, prefix, context, dest_type, body) VALUES ('Echo', 'Echo Test', '9196', 'default', 'FS_DEST_SYSTEM', 'answer\necho');
INSERT INTO routes (name, description, prefix, context, dest_type, body) VALUES ('User', 'Local Users', '1', 'default', 'FS_DEST_USER', NULL);
INSERT INTO routes (name, description, prefix, context, dest_type, body) VALUES ('User', 'Local Users', '1', 'public', 'FS_DEST_USER', NULL);
