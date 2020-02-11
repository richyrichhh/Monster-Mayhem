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
      oppTeam: {},
      oppChar: 0,
      refresh: false,
      loaded: false,
    }
  }

  componentDidMount() {
    const game = this.props.fetchGame(this.gameId)
      .then(() => this.getCurrentChar());
    const sockets = this.initializeSocketListeners();
    Promise.all([game, sockets]).then(() => this.setState({ loaded: true }))
  }

  componentDidUpdate() {
    if (this.state.refresh) {
      this.refresh();
    }
  }

  initializeSocketListeners() {
    this.socket.on("sendHptoFront", function (newCharData) {
      let charHp = document.getElementById(`charidhp-${newCharData._id}`).children[0];
      charHp.innerText = `${newCharData.currentHp}`
      let healthPct = newCharData.currentHp / newCharData.maxHp;

      if (healthPct < 0.3) {
        charHp.style.color = "red";
      } else {
        charHp.style.color = "green"
      }

    });

    this.socket.on("renderChars", (data) => {
      let newState = Object.assign({}, this.state);
      newState.refresh = true;
      this.setState(newState);
    })
  }

  charHealthBar(character) {
    let healthPct = character.currentHp / character.maxHp;
    let bar = "";
    for (var x = 0; x < Math.floor(character.currentHp / 10); x++) {
      bar += "|"
    }
    if (healthPct < 0.3) {
      return (
        <span className="warning-health">{bar}</span>
      );
    } else {
      return <span className="safe-health">{bar}</span>;
    }
  }

  handleDamage(amt) {
    let newState = Object.assign({}, this.state.team);
    newState[this.state.currentChar].currentHp -= amt;
    this.setState({
      team: newState
    })
  }

  handleQuit() {
    let gameId = this.gameId;
    let team = this.state.team
    this.props.exitGame(gameId, charId)
      .then(res => {
        this.socket.emit('leaveRoom', { gameId: res.game.gameId })
      })
    this.props.history.push(`/`)
  }

  refresh() {
    let newState = Object.assign({}, this.state);
    newState.refresh = false;
    this.setState(newState);
    this.props.getCampaign(this.campId);
  }

  switchChar(e, player) {
    let newState = Object.assign({}, this.state);
    if (player === 'player') {
      newState.currentChar === 0 ? newState.currentChar = 1 : newState.currentChar = 0;
    } else if (player === 'opponent') {
      newState.oppChar === 0 ? newState.oppChar = 1 : newState.oppChar = 0;
    }

    this.setState(newState)
  }

  render() {
    if (this.state.loaded) {
      return (
        <div id="gameplay-div">
          <span id="game-stage">
            <span>
              <span id="p1-side" className="lit-up">
                <img src={this.state.p1Char.imgUrl} />
                <span id="pc-hp"></span>
              </span>
              <span id="p2-side">
                <img src={this.state.p2Char.imgUrl} />
                <span id="ec-hp"></span>
              </span>
            </span>
          </span>
          <div id="game-moves" className="not-your-turn">
            <div id="character-moves">
              <ul id="character-moves-list">
                {this.state[`p${this.state.playerNum}Char`].moves.map(move => <li><button>{move.name}</button></li>)}
              </ul>
            </div>
            <span id="switch-character"><button>Switch</button></span>
          </div>
        </div>
      );
    } else {
      return (<div className="loading-page">
        <img src='./images/loading.jpg' alt="loading"/>
      </div>)
    }
  }
}


export default Play;

