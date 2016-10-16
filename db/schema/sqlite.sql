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
