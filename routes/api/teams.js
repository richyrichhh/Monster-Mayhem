const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Team = require('../../models/Team');


router.get('/user/:user_id', (req, res) => {
    Team.findById(req.params.userId)
        .then(team => res.json(team))
});

// router.get('/user/:user_id', (req, res) => {
//     Team
//         .find({ user: req.params.user_id })
// })

router.post('/',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        console.dir(req);
        const newTeam = new Team({
            team: req.body.monsters,
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