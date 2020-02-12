const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const User = require("./models/User");
const Game = require("./models/Game");
const bodyParser = require("body-parser");
const passport = require('passport');
const path = require('path');
const monsters = require('./routes/api/monsters');
const teams = require('./routes/api/teams');
const game = require('./routes/api/game');

const socketio = require("socket.io");
// const server = require('http').server(app);



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

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {console.log(`Listening on port ${port} successfully`)});

//Routes
app.use("/api/users", users)
app.use("/api/monsters", monsters);
app.use("/api/teams", teams);
app.use("/api/game", game);

app.use(express.static(__dirname + '/public'));



const io = socketio(server);

io.on("connection", function (socket, data) {
  console.log("made connection with socket " + socket.id);

  socket.on("sendJoinRoomToBack", function (data) {
    Game.findById(data.gameId).then(game => {
      socket.join(game._id); //Join a room
      console.log("Joined room: " + game._id)
    })
  })

  socket.on("joinGame", function (id) {
    socket.join(id); //Join a room
    console.log("Joined game " + id)
    io.to(id).emit("receive-room", "made it")
      io.to(game._id).emit("startGame", {p1: game.p1, p2: game.p2})

  });

  socket.on("sendMoveToBack", function (data) {
    console.log(data);
    io.to(data.gameId).emit("makeMove", data);
  })

  socket.on("leaveRoom", function (data) {
    // Campaign.findById(data.campId).then(camp => {
    //         io.to(camp.campKey).emit("renderChars", camp.campKey)
    // })
    // io.to(data.campKey).emit("renderChars")
  })

});





