CREATE TABLE users (
	id serial,
	data jsonb
);

CREATE TABLE extensions (
	id serial,
	user_id integer,
	data jsonb
);
