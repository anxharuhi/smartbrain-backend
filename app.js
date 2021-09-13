const express =  require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const knex = require('knex')

const app = express();
const salt = 10;

// FIX: Change hardcoded DB parameters to be passed on runtime
const db = knex({
  client: 'pg',
  connection: {
    host : 'HOSTNAME',
    port : PORT,
    user : 'USER',
    password : 'PASSWORD',
    database : 'DATABASE'
  },
});
app.use(express.json());
app.use(cors());

// FIX: Add data validation to prevent malicious attacks

// TODO: Separate endpoints to different files
// Sign in endpoint. Returns status 400 if user and password match with any entry on the database, returns
app.post('/signin', (req, res) => {
  const query = db('login').select('email', 'hash').where('email', req.body.email)
  query.then(credentials => {
    if(credentials.length > 0 && bcrypt.compareSync(req.body.password, credentials[0].hash)){
      return db('users').select('*').where('email', req.body.email)
        .then(user => {
          res.json(user[0])
        })
        .catch(_err => res.status(400).json('Unable to retrieve user'))
    } else{
      res.status(400).json('Wrong username or password')
    }
  }).catch(_err => res.status(400).json('Server error'))
})

// Register endpoint
app.post('/register', (req, res) => {
  const{ email, name, password } =  req.body;
  const transaction = db.transaction( trx => {
    return trx('login').insert({
     hash: bcrypt.hashSync(password, salt),
     email: email
    })
    .then( () => {
      return db('users').insert({
        name: name,
        email: email,
        joined: new Date()
      }, '*')})
  })
  transaction.then(user => {
    res.json(user[0])})
      .catch(_err => {
        res.status(400).send("Register error")
      })
})

// Profile endpoint to retrieve basic user information, like their name or rank
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db('users').where({
    id: id
  }).select('*')
    .then(user => {
      if(user.length === 0) {
        res.status(404).json('No such user')
      } else {
        res.json(user)
      }
    })
    .catch(_err => res.status(502).json('Internal Server Error'));
})

// Image rank endpoint. Will increment the image count by one for the user ID of the request
app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where({
      id: id
    }).increment('entries', 1)
    .returning('entries')
    .then(entries => {
    if(entries.length !== 0) {
      res.json(entries[0])
    } else {
      res.status(400).json('Request error.');
    }
    }).catch(_err => {
      res.status(502).json("Internal server error")
    })

//     let found = false;
//     database.users.forEach(user => {
//         if(user.id === id){
//             found = true;
//             user.entries++;
//             return res.json(user.entries);
//         }
//     });
//     if(!found) {
//         res.status(502).json('Internal server error. User non-existant. User was ', id, ' of type ', typeof(id));
//     }
})

// NOTE: Remember to add the port to the console log
app.listen(3010, () => console.log('Smartbrain api server is running on port '));
