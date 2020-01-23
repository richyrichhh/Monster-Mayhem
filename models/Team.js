const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Monster = require('./Monster');

const TeamSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    team: [Monster],
})

const Team = mongoose.model('team', TeamSchema);
module.exports = Team;