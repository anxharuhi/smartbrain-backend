CREATE TABLE login (
	id serial4 NOT NULL,
	email text NOT NULL,
	hash varchar(100) NOT NULL,
	CONSTRAINT login_email_key UNIQUE (email),
	CONSTRAINT login_pkey PRIMARY KEY (id)
);

CREATE TABLE users (
	id serial4 NOT NULL,
	"name" varchar(100) NULL,
	email text NOT NULL,
	entries int8 NULL DEFAULT 0,
	joined timestamp NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);
