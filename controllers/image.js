const Clarifai = require ("clarifai");

const app = new Clarifai.App({
  apiKey: 'INSERT YOUR API KEY HERE'
});

const apiCall = (req,res) => {
  app.models.predict('f76196b43bbd45c99b4f3cd8e8b40a8a', req.body.input)
    .then(data => {
      return res.json(data);
    })
    .catch(err => res.status(400).json('API error'))
}

const image = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where({
      id: id
    }).increment('entries', 1)
    .returning('entries')
    .then(entries => {
    if(entries.length !== 0) {
      return res.json(entries[0])
    } else {
      return res.status(400).json('Request error.');
    }
    }).catch(_err => {
      return res.status(502).json("Internal server error")
    })
}

module.exports = {
  image: image,
  apiCall: apiCall
};
