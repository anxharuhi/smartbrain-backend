const register = (req, res, bcrypt, db) => {
  const{ email, name, password } =  req.body;
  const salt = 10
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
        console.log(_err)
        res.status(400).send("Register error")
      })
}

module.exports = {
  register: register
};
