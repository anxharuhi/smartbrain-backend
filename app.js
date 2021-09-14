const express =  require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const knex = require('knex')
const signin = require('./controllers/signin')
const register = require('./controllers/register')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const app = express();

// FIX: Change hardcoded DB parameters to be passed on runtime
const db = knex({
  client: 'pg',
  connection: {
    host : 'HOST',
    port : PORT,
    user : 'USER',
    password : 'PASS',
    database : 'DB'
  },
});
app.use(express.json());
app.use(cors());

// FIX: Add data validation to prevent malicious attacks

// Endpoints
app.post('/signin', (req, res) => signin.login(req, res, bcrypt, db))
app.post('/register', (req, res) => register.register(req, res, bcrypt, db))
app.get('/profile/:id', (req, res) => profile.profile(req, res, db))
app.put('/image', (req, res) => image.image(req, res, db))

// NOTE: Remember to add the port to the console log
app.listen(3010, () => console.log('Smartbrain api server is running on port 3010'));
