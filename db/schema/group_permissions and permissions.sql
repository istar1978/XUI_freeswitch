CREATE TABLE "permissions"(
id INTEGER PRIMARY KEY,
action VARCHAR,
method VARCHAR,
param VARCHAR
);

CREATE TABLE group_permissions(
id INTEGER PRIMARY KEY,
group_id INTEGER,
permission_id INTEGER
);