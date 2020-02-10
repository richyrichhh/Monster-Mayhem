const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username
  });
})

// router.get("/", (req, res) => {
//   User.find().then(users => res.json(users));
// });

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Check to make sure nobody has already registered with a duplicate username
  User.findOne({ username: req.body.username })
  .then(user => {
    if (user) {
      // Throw a 400 error if the username address already exists
      errors.username = "A user has already registered with this username";
      return res.status(400).json(errors)
    } else {
      // Otherwise create a new user
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
      })

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              const payload = { id: user.id, username: user.username };
              jwt.sign(payload, keys.secretOrKey, (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              });
            })
            .catch(err => console.log(err));
        })
      })
    }
  })
})

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username })
  .then(user => {
    if (!user) {
      errors.username = "This user does not exist";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, username: user.username };

        jwt.sign(
          payload, keys.secretOrKey, (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          });
      } else {
        errors.password = "Incorrect Password";
        return res.status(400).json(errors);
      }
    })
  })
})



module.exports = router;