# Smartbrain learning project - Backend

This project was made as a learning experience in making a web app.
Comes from "The Complete Web Developer in 2021: Zero to Mastery" course from [@aneagoie]("https://github.com/aneagoie").
Functionality is simple, put an image in and it will detect if there are any faces on it using Clarifai AI pretrained model for that purpose.
Outside of that, it also has a very simple login/signup form.
This is the backend part of the project, which uses [Node.js](http://nodejs.org) and [Express](https://expressjs.com) for the basic web framework,  [bcryptjs](https://github.com/dcodeIO/bcrypt.js) as the Bcrypt hash implementation for safe password storage, and [knex.js](https://knexjs.org/) with [node-postgres](https://github.com/brianc/node-postgres) for connexting to a PostgreSQL database for information storage.

## Getting started

Clone this repo with:

```shell
git clone https://github.com/llomellamomario/smartbrain-backend
```

Then install dependencies and start the server with:


```shell
yarn install
yarn start
```

It should automatically start the new server on the port you've specified in `app.js`.
Outside any unforseen problems, it should be able to receive requests and communicate with the database specified in `app.js`
It does need 2 tables in the database, 'users' and 'login'.
Table 'users' should contain 'id', 'name', 'email', 'entries' and 'joined', while 'login' should contain 'id', 'email' and 'hash'.
Still deciding if to just include a file with the relevant SQL queries, forcing a manual install, or to go a step further and integrate it so it asks on first run.
Code is still messy (everything is inside `app.js`, when it should be properly separated), will get cleaned up.

## TO-DO

- [ ] Separate functionality in appropiate files based on concerns.
- [ ] Move Clarifai API calls to the backend, so the API key doesn't get exposed to a (malicious) end user.
- [ ] Add input validation. Probably there is middleware that implements said functionality.
- [ ] Add CLI parameters to pass port/db on runtime.
- [ ] Add a nice way to create the database structure.

