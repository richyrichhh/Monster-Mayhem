const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    host: {
        type: String,
        required: true
    },
    p2: {
        type: String
    },
    active: {
        type: Boolean
    },
    full: {
        type: Boolean
    }
});

const Game = mongoose.model('game', GameSchema);
module.exports = Game;
