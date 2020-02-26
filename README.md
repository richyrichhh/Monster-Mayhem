# Monster Mayhem

## Overview ##
Monster Mayhem is an online multiplayer battle arena game based on class horror movie characters.  The goal of the player is to use strategies based on characters' moves and abilities to diminish opposing characters health to zero.  The player to eliminate their opponents entire team wins. 

## Technologies Used ##
+ Javascript
+ React.js/Redux.js
+ Express.js
+ MongoDB
+ Websockets 

## Features ##
Allow for users to create an account or login if user is already registered, but a demo login feature is implemented if user does not want to create an account for any reason

Players can select two characters to add to their team with each character having their own sets of movies and abilities. Hovering over characters displays character stats, movies, and abilities. 
![Team Selection](https://github.com/nguyendarryl/Monster-Mayhem/blob/master/frontend/public/images/start_fight.jpg?raw=true)

The game implements websockets to provide a temporary server, allowing for multiplayer experience through joining two players online through matching websocket identification numbers.  Players can battle each other in real time. 
```
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
    // console.log(data);
    io.to(data.gameId).emit("makeMove", data);
  });

  socket.on("sendMovesToBack", function(data) {
    console.dir(data);
    io.to(data.gameId).emit("handleTurn", data);
  })

  socket.on("leaveRoom", function (data) {
    // Campaign.findById(data.campId).then(camp => {
    //         io.to(camp.campKey).emit("renderChars", camp.campKey)
    // })
    // io.to(data.campKey).emit("renderChars")
  })

});
```





