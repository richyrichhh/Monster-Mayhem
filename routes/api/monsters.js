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
    Monster.findById({monster: req.params.id})
        .then(monster => res.json(monster))
});
      


module.exports = router;