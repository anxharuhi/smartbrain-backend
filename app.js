const express =  require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const knex = require('knex')
const { body, validationResult } = require('express-validator')
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
    database : 'DATABASE'
  },
});
app.use(express.json());
app.use(cors());

// FIX: Add data validation to prevent malicious attacks

// Endpoints
app.post('/signin',
  body('email').isEmail().normalizeEmail().trim().escape().stripLow(),
  body('password').not().isEmpty().trim().escape().stripLow(),
  (req, res) => signin.login(req, res, bcrypt, db, validationResult))
app.post('/register',
  body('email').isEmail().normalizeEmail().trim().escape().stripLow(),
  body('password').not().isEmpty().trim().escape().stripLow(),
  body('name').not().isEmpty().trim().escape().stripLow(),
  (req, res) => register.register(req, res, bcrypt, db, validationResult))
app.get('/profile/:id',
  (req, res) => profile.profile(req, res, db))
app.put('/image', (req, res) => image.image(req, res, db))

// NOTE: Remember to add the port to the console log
app.listen(3010, () => console.log('Smartbrain api server is running on port 3010'));
