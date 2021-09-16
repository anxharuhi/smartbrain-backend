const express =  require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const knex = require('knex')
const { body, validationResult } = require('express-validator')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const signin = require('./controllers/signin')
const register = require('./controllers/register')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const app = express();

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [OPTIONS]')
  .alias('h', 'help').describe('h', 'Show help')
  .alias('s', 'server').describe('s', 'Location of the Postgre database')
  .alias('p', 'port').describe('p', 'Port of the Postgre database')
  .alias('u', 'user').describe('u', 'User to access the database')
  .alias('k', 'password').describe('k', 'Password for the database user')
  .alias('d', 'database').describe('d', 'Database name in the server')
  .alias('l', 'listen').describe('l', 'Port where the server will listen on, default 3010').default('l', 3010)
  .alias('i', 'install').describe('i', 'Install database schema (default false, TBI)').boolean('i')
  .alias('v', 'version')
  .demandOption(['server', 'port', 'user', 'password', 'database'])
  .epilog('That\'s all folks!')
  .argv

// FIX: Change hardcoded DB parameters to be passed on runtime
const db = knex({
  client: 'pg',
  connection: {
    host : argv.server,
    port : argv.port,
    user : argv.user,
    password : argv.password,
    database : argv.database
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
app.listen(argv.listen, () => console.log(`Smartbrain api server is running on port ${argv.listen}`));
