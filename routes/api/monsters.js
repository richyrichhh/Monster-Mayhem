const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Monster = require('../../models/Monster');

router.get('/', (req, res) => {
  Monster.find()
    .then(monsters => res.json(monsters))
});

router.get('/:id', (req, res) => {
  Monster.findById(req.params.id)
    .then(monster => res.json(monster))
});

router.post('/', (req, res) => {
  const newMonster = new Monster({
    name: req.body.name,
    health: req.body.health,
    defense: req.body.defense,
    attack: req.body.attack,
    speed: req.body.speed,
    imageUrl: req.body.imageUrl,
    movespool: req.body.movespool
  });

  newMonster.save().then(monster => res.json(monster));
});

router.delete("/:id", (req, res) => {
  Monster.findByIdAndDelete(req.params.id, function(err, event) {
    if (err)
      return res.status(500).send("There was a problem deleting the event.");
    res.status(200).send(event);
  });
});
      

module.exports = router;