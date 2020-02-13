import React from 'react';
import io from 'socket.io-client';

const testMonster = 
{_id: 0,
  currentHp: 90,
  maxHp: 90,
  attack: 100,
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
    this.currentUserId = this.props.user.id;
    // console.dir(this.props.user);
    this.socket = process.env.NODE_ENV === 'production' ? io() : io('http://localhost:5000')
    this.socket.emit("sendJoinRoomToBack", {
      gameId: this.gameId
    })

    this.state = {
      playerNum: 1,
      p1: null,
      p2: null,
      p1Team: p1TestTeam,
      p1Char: 0,
      p2Team: p2TestTeam,
      p2Char: 0,
      p1Moved: false,
      p1Move: null,
      p2Moved: false,
      p2Move: null,
      refresh: false,
      loaded: false
    }

    window.state = this.state;
    window.currentUserId = this.currentUserId;
    
    this.initializeGame = this.initializeGame.bind(this);
    this.makeMove = this.makeMove.bind(this);
  }

  componentDidMount() {
    const game = this.props.fetchGame(this.gameId)
      .then((game) => this.initializeGame(game));
    const sockets = this.initializeSocketListeners();
    Promise.all([game, sockets]).then(() => {
      if (this.state.p1 && this.state.p2) {
        this.setState({loaded: true});
      }
      // teams && this.game ? this.setState({ loaded: true }) : "";
    })
  }

  componentDidUpdate() {
    if (this.state.refresh) {
      this.refresh();
    }
  }

  initializeGame(data) {
    this.game = data.game.data;
    this.state.p1 = this.game.host
    this.state.p2 = this.game.p2
    console.dir(this.state);
  }

  initializeSocketListeners() {
    this.socket.on("startGame", (data) => {
      let newState = Object.assign({}, this.state);
      console.dir(data);
      newState.refresh = true;
      this.setState(newState);
    });

    this.socket.on("makeMove", (data) => {
      console.log('making move');
      let newState = Object.assign({}, this.state);
      if (data.player === 1) {
        newState.p1Move = data.move;
        newState.p1Moved = true;
      } else if (data.player === 2) {
        newState.p2Move = data.move;
        newState.p2Moved = true;
      }
      newState.refresh = true;
      this.setState(newState);
      if (newState.p1Moved && newState.p2Moved) {
        this.socket.emit('handleMovesToBack', { p1Move: this.state.p1Move, p2Move: this.state.p2Move, gameId: this.gameId });
      }
      // } else {
      //   newState.refresh = true;
      //   this.setState(newState);
      // }
    });

    this.socket.on("handleMoves", (data) => {
      let newState = Object.assign({}, this.state);
      // do damage stuff

      const p1Char = this.state.p1Team[this.state.p1Char];
      const p2Char = this.state.p2Team[this.state.p2Char];

      if (p1Char.speed > p2Char.speed){
        p2Char.curentHp -= (p1Char.attack / 10) * this.state.p1move;
        console.log(p2Char.currentHp);
      } else {
        p1Char.currentHp -= (p2Char.attack / 10) * this.state.p2move;
        console.log(p1Char.currentHp);
      }

      console.log('damage is dealt now');
      newState.p1Moved = false;
      newState.p2Moved = false;
      newState.p1Move = null;
      newState.p2Move = null;
      newState.refresh = true;
      setTimeout(() => this.setState(newState), 3000);
    });
  }

  makeMove(move, player) {
    console.log('clicked makemove');
    console.log(`${move} ${player}`);
    this.socket.emit('sendMoveToBack', { move: move, player: player, gameId: this.gameId });
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

  renderMoves() {
    if ((this.state.p1 === this.currentUserId && this.state.p1Moved === false) || (this.state.p2 === this.currentUserId && this.state.p2Moved === false)) {
      return (
        <div id="game-moves">
          <div id="character-moves">
            <ul id="character-moves-list">
              {this.state[`p${this.state.p1 === this.currentUserId ? '1' : '2'}Team`][this.state.p1 === this.currentUserId ? this.state.p1Char : this.state.p2Char].moves.map((move, i) => <li key={`move-${i}`}><button onClick={(e) => this.makeMove(move, this.state.p1 === this.currentUserId ? 1 : 2)}>{move.name}</button></li>)}
            </ul>
          </div>
          <span id="switch-character"><button onClick={() => console.log('switch')}>Switch</button></span>
        </div>
      )
    } else {
      return (
        <div id="game-moves">
          Waiting...
        </div>
      )
    }
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
          {this.renderMoves()}
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

