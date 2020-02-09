const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Game = require('../../models/Game');

router.post("/", (req, res) => {
    const newGame = new Game({
      user1: req.body.user1,
      user2: req.body.user2,
      winner: req.body.winner,
      loser: req.body.loser

    });

    newGame.save().then(game => res.json(game));
  }
);

router.get("/", (req, res) => {
  Game.find().then(games => res.json(games));
});

module.exports = router;