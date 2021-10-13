const express =  require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const knex = require('knex')
const { body, validationResult } = require('express-validator')
// const yargs = require('yargs/yargs')
// const { hideBin } = require('yargs/helpers')
const signin = require('./controllers/signin')
const register = require('./controllers/register')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const app = express();

// Eniromental variables
const SERVER = process.env.SERVER
const DBPORT = process.env.DBPORT
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DBNAME = process.env.DBNAME
const PORT = process.env.PORT ? process.env.PORT : 3010

// const argv = yargs(hideBin(process.argv))
//   .usage('Usage: $0 [OPTIONS]')
//   .alias('h', 'help').describe('h', 'Show help')
//   .alias('s', 'server').describe('s', 'Location of the Postgre database')
//   .alias('p', 'port').describe('p', 'Port of the Postgre database')
//   .alias('u', 'user').describe('u', 'User to access the database')
//   .alias('k', 'password').describe('k', 'Password for the database user')
//   .alias('d', 'database').describe('d', 'Database name in the server')
//   .alias('l', 'listen').describe('l', 'Port where the server will listen on, default 3010').default('l', 3010)
//   .alias('v', 'version')
//   .demandOption(['server', 'port', 'user', 'password', 'database'])
//   .epilog('That\'s all folks!')
//   .argv

const db = knex({
  client: 'pg',
  connection: {
    host : SERVER,
    port : DBPORT,
    user : USER,
    password : PASSWORD,
    database : DBNAME
  },
});
app.use(express.json());
app.use(cors());

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
app.post('/imageurl', (req, res) => image.apiCall(req, res))

// NOTE: Remember to add the port to the console log
app.listen(PORT, () => console.log(`Smartbrain api server is running on port ${PORT}`));
