const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Team = require('../../models/Team');


router.get('/user/:user_id', (req, res) => {
    Team.findById({ move: req.params.id })
        .then(move => res.json(move))
});

// router.get('/user/:user_id', (req, res) => {
//     Team
//         .find({ user: req.params.user_id })
// })

router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {

        const newTeam = new Team({
            text: req.body.monsters,
            user: req.user.id
        });

        newTeam.save().then(team => res.json(team));
    }
);

router.patch('/user/:user_id', (req, res, next) => {
    Team.findOneAndUpdate({ userId: req.params.userId},
        req.body,
        // console.log(req.body),
        { new: true })
        .then((event) => {
            // console.log(event);
            res.json(event);
        });
    }
);



module.exports = router; 