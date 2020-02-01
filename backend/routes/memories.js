const router = require('express').Router();
let Memories = require('../models/memories.models');

router.route('/').get((req, res) => {
  Memories.find()
    .then(memories => res.json(memories))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const color = req.body.color;
  const description = req.body.description;


  const newEntry = new Memories({ color, description });

  newEntry.save()
    .then(() => res.json('Entry added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router; 