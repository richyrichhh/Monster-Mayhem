const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    user1: {
        // type: Schema.Types.ObjectId, 
        // ref: "user"
        type: String,
        required: true
    },
    user2: {
        // type: Schema.Types.ObjectId,
        // ref: "user"
        type: String,
        required: true
    },
    winner: {
        type: String,
        required: true
    },
    loser: {
        type: String,
        required: true
    }
});

const Game = mongoose.model('game', GameSchema);
module.exports = Game;

