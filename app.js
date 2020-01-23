const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const User = require("./models/User");
const bodyParser = require('body-parser') //postman testing
const passport = require('passport');
const monsters = require('./routes/api/monsters');
const teams = require('./routes/api/teams');

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  const user = new User({
    username: "jim",
    email: 'Jim@jim.jim',
    password: "jimisgreat"
  })
  user.save()
  res.send("Hello Pokemon World")
});

app.use("/api/users", users);
app.use("/api/monsters", monsters);
app.use("/api/teams", teams);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port} successfully`));