const express =  require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const knex = require('knex')
const signin = require('./controllers/signin')
const register = require('./controllers/register')
const profile = require('./controllers/profile')
const app = express();
const salt = 10;

// FIX: Change hardcoded DB parameters to be passed on runtime
const db = knex({
  client: 'pg',
  connection: {
    host : 'localhost',
    port : 5432,
    user : 'development',
    password : 'webdev',
    database : 'smartbrain'
  },
});
app.use(express.json());
app.use(cors());

// FIX: Add data validation to prevent malicious attacks

// TODO: Separate endpoints to different files
// Endpoints
app.post('/signin', (req, res) => signin.login(req, res, bcrypt, db))
app.post('/register', (req, res) => register.register(req, res, bcrypt, db))

app.get('/profile/:id', (req, res) => profile.profile(req, res, db))

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
app.listen(3010, () => console.log('Smartbrain api server is running on port 3010'));
