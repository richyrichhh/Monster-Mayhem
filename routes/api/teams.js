const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Team = require('../../models/Team');


router.get('/user/:userId', (req, res) => {
    // Team.findById(req.params.userId)
    //     .then(team => res.json(team))
    // console.log(req.params);
    Team.findOne({user: req.params.userId}).then(team => res.json(team));
});

// router.get('/user/:user_id', (req, res) => {
//     Team
//         .find({ user: req.params.user_id })
// })

router.post('/',
    // passport.authenticate('jwt', { session: false }),
    (req, res) => {
        // console.dir(req.body);
        const newTeam = new Team({
            team: [],
            user: req.body.id
        });

        newTeam.save().then(team => res.json(team));
    }
);

router.patch('/user/:userId', (req, res, next) => {
    // console.dir(req.params);
    // console.dir(req.body);
    Team.findOneAndUpdate({ user: req.params.userId},
        req.body,
        // console.log(req.body),
        { new: true })
        .then((event) => {
            // console.log(event);
            // console.log('updating!!!');
            res.json(event);
        });
    }
);


module.exports = router; 