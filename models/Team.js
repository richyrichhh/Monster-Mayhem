const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  user: {
    // type: Schema.Types.ObjectId,
    // ref: "user"
    type: String,
    required: true
  },
  team: [
    {
      type: Schema.Types.ObjectId,
      ref: "monster"
    }]
});

const Team = mongoose.model('team', TeamSchema);
module.exports = Team;