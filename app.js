const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const User = require("./models/User");
const bodyParser = require("body-parser");
const passport = require('passport');
const path = require('path');
const monsters = require('./routes/api/monsters');
const teams = require('./routes/api/teams');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongoDB successfully"))
  .catch(err => console.log(err));

app.get("/", (req, res) => { res.send("Hello Monster World!")});

app.use(passport.initialize());
require('./config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users)
app.use("/api/monsters", monsters);
app.use("/api/teams", teams);


const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Listening on port ${port} successfully`)});

