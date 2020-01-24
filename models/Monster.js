const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MoveSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    strength: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    effect: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    }
});

const MonsterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    health: {
        type: Number, //check if its capital 
        min: 0,
        max: 100,
        required: true
    },
    attack: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    defense: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    speed: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    movespool: [MoveSchema]

})

module.exports = Monster = mongoose.model('monster', MonsterSchema);

