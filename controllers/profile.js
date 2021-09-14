const profile = (req, res) => {
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
}

module.export = {
  profile: profile
}
