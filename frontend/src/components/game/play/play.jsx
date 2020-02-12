import React from 'react';
import io from 'socket.io-client';

const testMonster = 
{_id: 0,
  currentHp: 90,
  maxHp: 90,
  strength: 100,
  agility: 100,
  defense: 100,
  moves: [{ name: 'tackle', power: 10 }, { name: 'tackle', power: 10 }, { name: 'tackle', power: 10 }, { name: 'tackle', power: 10 }],
  imgUrl: './images/test-char.png'};

let p1TestTeam = [Object.assign({}, testMonster), Object.assign({}, testMonster)]
let p2TestTeam = [Object.assign({}, testMonster), Object.assign({}, testMonster)]


class Play extends React.Component {
  constructor(props) {
    super(props);
    this.gameId = this.props.match.params.gameId;
    this.socket = process.env.NODE_ENV === 'production' ? io() : io('http://localhost:5000')
    this.socket.emit("sendJoinRoomToBack", {
      gameId: this.gameId
    })

    console.dir(this.props.user);

    this.initializeGame = this.initializeGame.bind(this);

    this.state = {
      playerNum: 1,
      p1Team: p1TestTeam,
      p1Char: 0,
      p2Team: p2TestTeam,
      p2Char: 0,
      refresh: false,
      loaded: false
    }

    console.log(this.state['p1Char']);
  }

  componentDidMount() {
    const game = this.props.fetchGame(this.gameId)
      .then((game) => this.initializeGame(game));
    const sockets = this.initializeSocketListeners();
    const teams = this.state.p1Team.length + this.state.p2Team.length === 4;
    Promise.all([game, sockets]).then(() => teams ? this.setState({ loaded: true }) : "")
  }

  componentDidUpdate() {
    if (this.state.refresh) {
      this.refresh();
    }
  }

  initializeGame(data) {
    this.game = data.game.data;
    console.dir(this.game);
  }

  initializeSocketListeners() {
    this.socket.on("renderChars", (data) => {
      let newState = Object.assign({}, this.state);
      newState.refresh = true;
      this.setState(newState);
    });

    this.socket.on("receiveMove", (data) => {
      let newState = Object.assign({}, this.state);
      newState.refresh = true;
      // do move stuff
      this.setState(newState);
    });

    this.socket.on("receiveDamage", (data) => {
      let newState = Object.assign({}, this.state);
      newState.refresh = true;
      // do damage stuff
      this.setState(newState);
    });
    
  }

  charHealthBar(character) {
    let healthPct = character.currentHp / character.maxHp;
    let bar = "";


    for (var x = 0; x < Math.floor(character.currentHp / 10); x++) {
      bar += "|"
    }
    if (healthPct < 0.4) {
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
    this.props.exitGame(gameId)
      .then(res => {
        this.socket.emit('leaveRoom', { gameId: res.game.gameId })
      })
    this.props.history.push(`/`)
  }

  refresh() {
    let newState = Object.assign({}, this.state);
    newState.refresh = false;
    this.setState(newState);
    this.props.fetchGame(this.gameId);
  }

  switchChar(e, player) {
    let newState = Object.assign({}, this.state);
    if (player === 1) {
      newState.p1Char === 0 ? newState.p1Char = 1 : newState.p1Char = 0;
    } else if (player === 2) {
      newState.p2Char === 0 ? newState.p2Char = 1 : newState.p2Char = 0;
    }

    this.setState(newState)
  }

  render() {
    if (this.state.loaded) {
      return (
        <div id="gameplay-div">
          <span id="play-background">
            <span>
              <span id="p1-side" className="lit-up">
                <img src={this.state.p1Team[this.state.p1Char].imgUrl} className="game-character-img game-left" />
                <span id="p1-hp"></span>
              </span>
              <span id="p2-side">
                <img src={this.state.p2Team[this.state.p2Char].imgUrl} className="game-character-img game-right" />
                <span id="p2-hp"></span>
              </span>
            </span>
          </span>
          <div id="game-moves" className="not-your-turn">
            <div id="character-moves">
              <ul id="character-moves-list">
                {this.state[`p${this.state.playerNum}Team`][this.state.playerNum === 1 ? this.state.p1Char : this.state.p2Char].moves.map(move => <li><button>{move.name}</button></li>)}
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

