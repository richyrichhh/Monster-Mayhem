import React from 'react';
import io from 'socket.io-client';
const switchMove = {
  name: 'switch',
  power: 0,
  effects: ['switch']
}
const testMonster = 
{_id: 0,
  currentHp: 90,
  maxHp: 90,
  attack: 100,
  speed: 100,
  defense: 100,
  moves: [{ name: 'tackle', power: 10, effects: [], effects: [] }, { name: 'tackle', power: 10, effects: [] }, { name: 'tackle', power: 10, effects: [] }, { name: 'tackle', power: 10, effects: [] }],
  imgUrl: './images/test-char.png',
  animations: {
    base: './images/test-char',
    attack: {path: './images/attack-', frames: 5},
    filetype: '.png'
  }
};

const testMonster2 = 
{_id: 1,
  currentHp: 90,
  maxHp: 90,
  attack: 100,
  speed: 100,
  defense: 100,
  moves: [{ name: 'tackle', power: 10, effects: [] }, { name: 'tackle', power: 10, effects: [] }, { name: 'tackle', power: 10, effects: [] }, { name: 'tackle', power: 10, effects: [] }],
  imgUrl: './images/darryl_nguyen.jpg',
  animations: {
    base: './images/test-char',
    attack: { path: './images/attack-', frames: 5 },
    filetype: '.png'
  }
};

let p1TestTeam = [Object.assign({}, testMonster), Object.assign({}, testMonster2)]
let p2TestTeam = [Object.assign({}, testMonster), Object.assign({}, testMonster2)]

const damageFormula = (monsterOne, move, monsterTwo) => {
  return monsterOne.attack * move.power / monsterTwo.defense;
};

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
    
    this.turn = false;
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
        this.socket.emit('sendMovesToBack', { p1Move: this.state.p1Move, p2Move: this.state.p2Move, gameId: this.gameId });
      }
    });

    this.socket.on("handleTurn", (data) => {
      if (!this.turn) {
        this.turn = true;
        let newState = Object.assign({}, this.state);
        newState = Object.assign(newState, {p1Move: data.p1Move, p1Moved: true, p2Move: data.p2Move, p2Moved: true})
        newState.p1Move = data.p1Move;
        newState.p1Moved = true;
        newState.p2Move = data.p2Move;
        newState.p2Moved = true;
  
        newState = this.handleSwitch(newState);
        newState = this.handleCombat(newState);

        setTimeout(() => {
          console.log('turn is ending');
          this.turn = false;
          newState.p1Moved = false;
          newState.p2Moved = false;
          newState.p1Move = null;
          newState.p2Move = null;
          newState.refresh = true;
          setTimeout(() => this.setState(newState), 1000);
        }, 1000);
      }
    });
  }

  handleSwitch(state) {
    if (state.p1Move.effects.includes('switch')) state.p1Char = state.p1Char === 0 ? 1 : 0;
    if (state.p2Move.effects.includes('switch')) state.p2Char = state.p2Char === 0 ? 1 : 0;
    this.setState(state);
    return state;
  }

  handleCombat(state) {
    let effSpd1 = state.p1Char.speed;
    let effSpd2 = state.p2Char.speed;
    if (effSpd1 > effSpd2) {
      this.playAnimation(1, 'attack');
      setTimeout(() => {this.handleDamage(state.p1Team[state.p1Char], state.p1Move, state.p2Team[state.p2Char])
      if (state.p2Team[state.p2Char].currentHp > 0) {
        setTimeout(() => {this.playAnimation(2, 'attack');
        setTimeout(() => this.handleDamage(state.p2Team[state.p2Char], state.p2Move, state.p1Team[state.p1Char]), 1000);
      }, 1000)
      }}, 1000);
    } else {
      this.playAnimation(2, 'attack');
      setTimeout(() => {
        this.handleDamage(state.p2Team[state.p2Char], state.p2Move, state.p1Team[state.p1Char])
        if (state.p1Team[state.p1Char].currentHp > 0) {
          setTimeout(() => {
            this.playAnimation(1, 'attack');
            setTimeout(() => this.handleDamage(state.p1Team[state.p1Char], state.p1Move, state.p2Team[state.p2Char]), 1000);
          }, 1000)
        }
      }, 1000);
    }
    return state;
  }

  handleDamage(attacker, move, target, damage) {
    // let effects = move.effects;
    damage = damage || damageFormula(attacker, move, target);
    target.currentHp -= damage;
  }

  playAnimation(player, animation) {
    if (player === 1) {
      let char = this.state.p1Team[this.state.p1Char];
      for (var i = 0; i < char.animations[animation].frames; i++) {
        setTimeout(() => {
          let newState = Object.assign({}, this.state);
          let character = newState.p1Team[newState.p1Char];
          character.imgUrl = character.animations[animation].path + i.to_s() + character.animations.filetype;
        }, 120 * i);
      }
    }
  }

  handleDeath(player) {

  }

  makeMove(move, player) {
    console.log('clicked makemove');
    console.log(`${move} ${player}`);
    this.socket.emit('sendMoveToBack', { move: move, player: player, gameId: this.gameId });
  }

  sendSwitch(player) {
    console.log('clicked switch');
    this.socket.emit('sendMoveToBack', { move: switchMove, player: player, gameId: this.gameId })
  }

  charHealthBar(character) {
    let healthPct = character.currentHp / character.maxHp;
    let bar = "";


    for (var x = 0; x < Math.floor(character.currentHp / 5); x++) {
      bar += "|"
    }
    if (healthPct < 0.3) {
        // return <span className="healthbar danger-health">{bar}</span>;
        return <span className="healthbar danger-health">{character.currentHp} / {character.maxHp}</span>;
    } else if (healthPct < 0.5) {
        return <span className="healthbar warning-health">{character.currentHp} / {character.maxHp}</span>;

        // return <span className="healthbar warning-health">{bar}</span>;
    } else {
      return <span className="healthbar safe-health">{character.currentHp} / {character.maxHp}</span>;
      // return <span className="healthbar safe-health">{bar}</span>;
    }
  }

  handleQuit() {
    let gameId = this.gameId;
    let team = this.state.team;
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

  switchChar(player) {
    let newState = Object.assign({}, this.state);
    if (player === 1) {
      newState.p1Char === 0 ? newState.p1Char = 1 : newState.p1Char = 0;
    } else if (player === 2) {
      newState.p2Char === 0 ? newState.p2Char = 1 : newState.p2Char = 0;
    }
    this.setState(newState)
  }

  renderMoves() {
    const playerNum = (this.state.p1 === this.currentUserId ? 1 : this.state.p2 === this.currentUserId ? 2 : 0)
    if ((this.state.p1 === this.currentUserId && this.state.p1Moved === false) || (this.state.p2 === this.currentUserId && this.state.p2Moved === false)) {
      return (
        <div id="game-moves">
          <div id="character-moves">
            <ul id="character-moves-list">
              {this.state[`p${this.state.p1 === this.currentUserId ? '1' : '2'}Team`][this.state.p1 === this.currentUserId ? this.state.p1Char : this.state.p2Char].moves.map((move, i) => <li key={`move-${i}`}><button onClick={(e) => this.makeMove(move, this.state.p1 === this.currentUserId ? 1 : 2)}>{move.name}</button></li>)}
            </ul>
          </div>
          <span id="switch-character"><button onClick={() => this.sendSwitch(playerNum)}>Switch</button></span>
        </div>
      )
    } else {
      return (
        <div id="game-moves">
          <div id="character-moves">
            <ul id="character-moves-list">
              <button>
                Waiting...
              </button>
            </ul>
          </div>
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
                <span id="p1-hp">{this.charHealthBar(this.state.p1Team[this.state.p1Char])}</span>
              </span>
              <span id="p2-side">
                <img src={this.state.p2Team[this.state.p2Char].imgUrl} className="game-character-img game-right" />
                <span id="p2-hp">{this.charHealthBar(this.state.p2Team[this.state.p2Char])}</span>
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

