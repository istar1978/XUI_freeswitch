CREATE TABLE contexts (
	id INTEGER PRIMARY KEY,
	name VARCHAR,
	data TEXT
);


CREATE TABLE routings (
	id INTEGER PRIMARY KEY,
	context_id INTEGER,
	data TEXT
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
