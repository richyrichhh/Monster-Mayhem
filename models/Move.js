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
})

module.exports = Move = mongoose.model('move', MoveSchema);