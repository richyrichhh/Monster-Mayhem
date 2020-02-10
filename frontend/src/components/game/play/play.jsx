import React from 'react';
import io from 'socket.io-client';

class Play extends React.Component {
  constructor(props) {
    super(props);
    this.gameId = this.props.match.params.gameId;
    this.socket = process.env.NODE_ENV === 'production' ? io() : io('http://localhost:5000')
    this.socket.emit("sendJoinRoomToBack", {
      gameId: this.gameId
    })

    this.state = {
      team: {},
      currentChar: 0,
      reload: false,
      loaded: false,
    }
  }
}


export default Play;

