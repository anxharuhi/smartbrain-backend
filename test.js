const bcrypt = require('bcryptjs');
const knex = require('knex');

const salt = 10;
const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'development',
    password: 'webdev',
    database: 'smartbrain'
  },
})

function transactionTest(email, name, password) {
  db('login').insert({
    hash: bcrypt.hashSync(password, salt),
    email: email
  }).catch(err => console.log("Error introducing password into the databsase. Error was: ", err));
  db('users').insert({
      name: name,
      email: email,
      joined: new Date()
  }, ['*']).catch(err => console.log("Error introducing password into the databsase. Error was: ", err));
};


function transactionTest2(email, name, password) {

  let knexTransaction = db.transaction((trx) => {
    return trx('login').insert({
        hash: bcrypt.hashSync(password, salt),
        email: email
      })
      .catch(err => console.log('There was a login table error. The error was: \n', err))
      .then(() => {
        return trx('users').insert({
          name: name,
          email: email,
          joined: new Date()
        }, '*')})
      .catch(err => console.log('There was a users table error. The error was: \n', err))
  })
  knexTransaction.then(user => console.log(user[0]))
    .catch(err => console.log('There was an error. The error was: \n', err))
}


transactionTest2('doomguy@uac.space', 'Doomguy', 'cacodemon')
