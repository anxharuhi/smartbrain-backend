const login = (req, res, bcrypt, db, validationResult) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json('Problem validating input')
  } else {
    const query = db('login').select('email', 'hash').where('email', req.body.email)
    query.then(credentials => {
      if(credentials.length > 0 && bcrypt.compareSync(req.body.password, credentials[0].hash)) {
        return db('users').select('*').where('email', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(_err => res.status(400).json('Unable to retrieve user'))
      } else{
        res.status(400).json('Wrong username or password')
      }
    }).catch(_err => res.status(400).json('Server error'))
  }
}

module.exports = {
  login: login
};
