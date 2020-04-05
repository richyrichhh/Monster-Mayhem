const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Game = require('../../models/Game');

router.post("/", (req, res) => {
    const newGame = new Game({
      host: req.body.host,
      p2: req.body.p2 ? req.body.p2 : null,
      active: false,
      full: false
    });

    newGame.save().then(game => res.json(game));
  }
);

router.patch("/:id", (req, res) => {
  Game.findById(req.params.id).then(game => {
    game.active = req.body.active;
    game.full = req.body.full;
    game.p2 = req.body.p2;
    game.save().then(game => res.json(game));
  });
});

router.get("/", (req, res) => {
  Game.find().then(games => res.json(games));
});

router.get("/:id", (req, res) => {
  // console.dir(req.params.id);
  // Game.find().then(game=> console.dir(game));
  Game.findById(req.params.id).then(game => res.json(game));
});

module.exports = router;