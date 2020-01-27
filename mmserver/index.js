// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;
var fs = require('fs');
const axios = require('axios').default;

server.listen(port, () => {
  fs.writeFileSync(__dirname + '/start.log', 'started'); 
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));



var gameCollection = new function () {

  this.totalGameCount = 0,
  this.gameList = {}

};
// Chatroom

var numUsers = 0;
var loopLimit = 0; 

function buildGame(socket) {
  var gameObject = {};
  gameObject.id = (Math.random() + 1).toString(36).slice(2, 18);
  gameObject.playerOne = socket.username;
  gameObject.playerTwo = null;
  gameCollection.totalGameCount++;
  gameCollection.gameList[gameCollection.gameList.keys ? gameCollection.gameList.keys.length : 0] = { gameObject };


  console.log("Game Created by " + socket.username + " w/ " + gameObject.id);

  io.emit('gameCreated', {
    username: socket.username,
    gameId: gameObject.id
  });
};

function killGame(socket) {

  var notInGame = true;
  for (var i = 0; i < gameCollection.totalGameCount; i++) {

    var gameId = gameCollection.gameList[i]['gameObject']['id']
    var plyr1Tmp = gameCollection.gameList[i]['gameObject']['playerOne'];
    var plyr2Tmp = gameCollection.gameList[i]['gameObject']['playerTwo'];

    if (plyr1Tmp == socket.username) {
      --gameCollection.totalGameCount;
      console.log("Destroy Game " + gameId + "!");
      gameCollection.gameList.splice(i, 1);
      console.log(gameCollection.gameList);
      socket.emit('leftGame', { gameId: gameId });
      io.emit('gameDestroyed', { gameId: gameId, gameOwner: socket.username });
      notInGame = false;
    }
    else if (plyr2Tmp == socket.username) {
      gameCollection.gameList[i]['gameObject']['playerTwo'] = null;
      console.log(socket.username + " has left " + gameId);
      socket.emit('leftGame', { gameId: gameId });
      console.log(gameCollection.gameList[i]['gameObject']);
      notInGame = false;

    }

  }

  if (notInGame == true) {
    socket.emit('notInGame');
  }
}



function gameSeeker(socket) {
  ++loopLimit;
  if ((gameCollection.totalGameCount == 0) || (loopLimit >= 20)) {
    buildGame(socket);
    loopLimit = 0;

  }
  else {
    var rndPick = Math.floor(Math.random() * gameCollection.totalGameCount) || 0;
    console.log(rndPick);
    if (gameCollection.gameList[rndPick]['gameObject']['playerTwo'] == null) {
      gameCollection.gameList[rndPick]['gameObject']['playerTwo'] = socket.username;
      socket.emit('joinSuccess', {
        gameId: gameCollection.gameList[rndPick]['gameObject']['id']
      });

      console.log(socket.username + " has been added to: " + gameCollection.gameList[rndPick]['gameObject']['id']);
      console.dir(gameCollection.gameList);
      axios.post('http://localhost:5000/game', {
        user1: gameCollection.gameList[rndPick]['gameObject']['playerOne'],
        user2: gameCollection.gameList[rndPick]['gameObject']['playerTwo'],
        winner: null,
        loser: null
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else {
      gameSeeker(socket);
    }
  }
}

io.on('connection', (socket) => {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

  socket.on('joinGame', function () {

    console.log(socket.username + " wants to join a game");
    console.dir(gameCollection.gameList);
    var alreadyInGame = false;

    for (var i = 0; i < gameCollection.totalGameCount; i++) {
      var plyr1Tmp = gameCollection.gameList[i]['gameObject']['playerOne'];
      var plyr2Tmp = gameCollection.gameList[i]['gameObject']['playerTwo'];
      if (plyr1Tmp == socket.username || plyr2Tmp == socket.username) {
        alreadyInGame = true;

        console.log(socket.username + " already has a Game!");

        socket.emit('alreadyJoined', {
          gameId: gameCollection.gameList[i]['gameObject']['id']
        });

      }
    }
    if (alreadyInGame == false) {
      gameSeeker(socket);

    }
  });

  socket.on('leaveGame', function () {


    if (gameCollection.totalGameCount == 0) {
      socket.emit('notInGame');

    }

    else {
      killGame(socket);
    }

  });

  socket.on('makeGame', function () {
    console.log(JSON.stringify(gameCollection.gameList));

    var noGamesFound = true;
    for (var i = 0; i < gameCollection.totalGameCount; i++) {
      var tempName = gameCollection.gameList[i]['gameObject']['playerOne'];
      if (tempName == socket.username) {
        noGamesFound = false;

        console.log("This User already has a Game!");

        socket.emit('alreadyJoined', {
          gameId: gameCollection.gameList[i]['gameObject']['id']
        });

      }
    }

    if (noGamesFound == true) {

      var gameObject = {};
      gameObject.id = (Math.random() + 1).toString(36).slice(2, 18);
      gameObject.playerOne = socket.username;
      gameCollection.totalGameCount++;
      gameCollection.gameList[gameCollection.gameList.keys ? gameCollection.gameList.keys.length : 0] = { gameObject };


      console.log("Game Created by " + socket.username + " w/ " + gameObject.id);

      io.emit('gameCreated', {
        username: socket.username,
        gameId: gameObject.id
      });
    }
  });
  
  
});
