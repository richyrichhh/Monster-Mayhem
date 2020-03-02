import React from 'react';
import io from 'socket.io-client';

const switchMove = {
  name: 'switch',
  strength: 0,
  effect: 99
}

const testMonster = 
{_id: 0,
  currentHp: 90,
  maxHp: 90,
  attack: 100,
  speed: 100,
  defense: 100,
  movespool: [{ name: 'tackle', strength: 10, effect: 0 }, { name: 'useless', strength: 0, effect: 0 }, { name: 'oneshot', strength: 1000, effect: 0 }, { name: 'tackle', strength: 10, effect: 0 }],
  imgUrl: './images/test-char.png',
  animations: {
    base: './images/test-char',
    attack: {path: './images/animations/test/attack-', frames: 5},
    death: {path: './images/animations/test/attack-', frames: 5},
    idle: { path: '', frames: 0 },
    filetype: '.png'
  }
};

const testMonster2 = 
{_id: 1,
  currentHp: 90,
  maxHp: 90,
  attack: 120,
  speed: 10,
  defense: 200,
  movespool: [{ name: 'tackle', strength: 10, effect: 0 }, { name: 'useless', strength: 0, effect: 0 }, { name: 'oneshot', strength: 1000, effect: 0 }, { name: 'tackle', strength: 10, effect: 0 }],
  imgUrl: './images/darryl_nguyen.jpg',
  animations: {
    base: './images/darryl_nguyen',
    attack: { path: './images/animations/test/attack-', frames: 5 },
    death: { path: './images/animations/test/attack-', frames: 5 },
    idle: { path: '', frames: 0 },
    filetype: '.png'
  }
};

const monsterAnimations = {
  Chucky: {
  base: './images/animations/chucky/stand/chucky_1-1',
  attack: { path: './images/animations/chucky/stab/chucky_8-', frames: 10 },
  heavyAttack: { path: './images/animations/chucky/roundhouse-slash/chucky_12-', frames: 10 },
  death: { path: './images/animations/chucky/death/chucky_5-', frames: 5 },
  idle: { path: './images/animations/chucky/stand/chucky_1-', frames: 12 },
  filetype: '.png'
  },
  "Freddy Kreuger": {
    base: './images/animations/freddy/idle/freddy_0-0',
    kick: { path: './images/animations/freddy/kick/freddy_210-', frames: 10 },
    heavyKick: { path: './images/animations/freddy/roundhouse/freddy_240-', frames: 27 },
    knee: { path: './images/animations/freddy/knee/freddy_220-', frames: 14 },
    attack: { path: './images/animations/freddy/combo/freddy_200-', frames: 30 },
    death: { path: './images/animations/freddy/death/freddy_255-', frames: 11 },
    idle: { path: './images/animations/freddy/idle/freddy_0-', frames: 46 },
    filetype: '.png'
  },
  Pennywise: {
    base: './images/animations/penny/stand/penny_0-0',
    attack: { path: './images/animations/penny/punch/penny_100-', frames: 5 },
    heavyAttack: { path: './images/animations/penny/heavy-punch/penny_200-', frames: 4 },
    kick: { path: './images/animations/penny/kick/penny_200-', frames: 6 },
    death: { path: './images/animations/chucky/death/penny_440-', frames: 9 },
    idle: { path: './images/animations/penny/stand/penny_0-', frames: 7 },
    filetype: '.png'
  },
  "Jason Voorhees": {
    base: './images/animations/jason/stand/jason_0-0',
    attack: { path: './images/animations/jason/slash/jason_200-', frames: 13 },
    heavyAttack: { path: './images/animations/jason/heavy-slash/jason_610-', frames: 17 },
    punch: { path: './images/animations/jason/punch/jason_230-', frames: 7 },
    superHeavyAttack: { path: './images/animations/jason/chop/jason_210-', frames: 16 },
    range: { path: './images/animations/jason/bow/jason_1200-', frames: 13 },
    death: { path: './images/animations/jason/death/jason_5950-', frames: 16 },
    idle: { path: './images/animations/jason/stand/jason_0-', frames: 14 },
    filetype: '.png'
  }
}

let p1TestTeam = [Object.assign({}, testMonster), Object.assign({}, testMonster2)]
let p2TestTeam = [Object.assign({}, testMonster), Object.assign({}, testMonster2)]

const damageFormula = (monsterOne, move, monsterTwo) => {
  return monsterOne.attack * move.strength / monsterTwo.defense;
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
      charStates: 'idle',
      playerNum: 1,
      p1: null,
      p2: null,
      p1Team: p1TestTeam,
      p1Char: 0,
      p2Team: p2TestTeam,
      p2Char: 0,
      p1Moved: false,
      p1Move: null,
      p1CanSwitch: true,
      p2Moved: false,
      p2Move: null,
      p2CanSwitch: true,
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
    let newState = Object.assign({}, this.state);
    newState.p1 = this.game.host;
    newState.p2 = this.game.p2;
    this.setState(newState);
    this.monsters = {};
    let p1load, p2load;
    this.props.fetchMonsters().then(data => {
      for (let monster of data.monsters.data) {
        this.monsters[monster._id] = monster;
      }
      console.dir(this.monsters);
      p1load = this.props.fetchTeam(this.game.host).then(data => {
        console.dir(data.team.data.team)
        let p1Team = data.team.data.team.map(id => {
          let monster = Object.assign({}, this.monsters[id]);
          monster = this.fixMonster(monster);
          console.log(monster);
          return monster;
        })
        return p1Team;
      });
      p2load = (this.game.p2) ? this.props.fetchTeam(this.game.p2).then(data => {
        console.log('p2 is' + this.game.p2);
        console.dir(data.team.data.team)
        let p2Team = data.team.data.team.map(id => {
          let monster = Object.assign({}, this.monsters[id]);
          monster = this.fixMonster(monster);
          console.log(monster);
          return monster;
        })
        return p2Team;
      }) : null;

      Promise.all([p1load, p2load]).then((data) => {
        console.dir(data);
        let state = Object.assign({}, this.state);
        state.p1Team = data[0];
        state.p2Team = data[1];
        this.setState(state);
        // teams && this.game ? this.setState({ loaded: true }) : "";
      })
    });


    console.log(newState);
    
    // console.dir(this.state);
  }

  fixMonster(monster) {
    monster.animations = monsterAnimations[monster.name]
    console.log(monsterAnimations["Jason Voorhees"]);
    monster.imgUrl = monster.animations.base + monster.animations.filetype;
    monster.currentHp = monster.health;
    monster.maxHp = monster.health;
    return monster;
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
        // let newState = Object.assign({}, this.state);
        // newState = Object.assign(newState, {p1Move: data.p1Move, p1Moved: true, p2Move: data.p2Move, p2Moved: true})
        // newState.p1Move = data.p1Move;
        // newState.p1Moved = true;
        // newState.p2Move = data.p2Move;
        // newState.p2Moved = true;
        this.prepTurn(data)
          .then((newState) => this.handleSwitch(newState)
          .then((state) => this.handleCombat(state)
          .then(() => {
            setTimeout(() => {
              newState = Object.assign({}, this.state);
              console.log('turn is ending');
              this.turn = false;
              newState.p1Moved = false;
              newState.p2Moved = false;
              newState.p1Move = null;
              newState.p2Move = null;
              newState.refresh = true;
              setTimeout(() => this.setState(newState), 1000);
            }, 2000);
          })));
        // newState = this.handleSwitch(newState);
        // newState = this.handleCombat(newState);

      }
    });
  }

  prepTurn(data) {
    return new Promise((resolve, reject) => {
      let newState = Object.assign({}, this.state);
      newState = Object.assign(newState, { p1Move: data.p1Move, p1Moved: true, p2Move: data.p2Move, p2Moved: true })
      newState.p1Move = data.p1Move;
      newState.p1Moved = true;
      newState.p2Move = data.p2Move;
      newState.p2Moved = true;
      newState.charStates = 'battle'
      this.setState(newState);
      resolve(newState);
    })
  }

  handleSwitch(state) {
    return new Promise((resolve, reject) => {
      if (state.p1Move.effect === 99) state.p1Char = state.p1Char === 0 ? 1 : 0;
      if (state.p2Move.effect === 99) state.p2Char = state.p2Char === 0 ? 1 : 0;
      this.setState(state);
      resolve(state);
    })
  }

  handleCombat(state) {
    return new Promise((resolve, reject) => {
      let effSpd1 = state.p1Team[state.p1Char].speed;
      let effSpd2 = state.p2Team[state.p2Char].speed;
      if (effSpd1 === effSpd2) {
        if (Math.random() < 0.5) {
          effSpd1 += 1;
        } else {
          effSpd2 += 1;
        }
      }
      if (effSpd1 > effSpd2) {
        this.playAnimation(1, 'attack').then(() => {
          state = this.handleDamage(1, this.state);
          if (state.p2Team[state.p2Char].currentHp > 0) {
            setTimeout(() => {
              this.playAnimation(2, 'attack').then(() => {
                state = this.handleDamage(2, this.state);
                if (state.p1Team[state.p1Char].currentHp <= 0) {
                  this.handleDeath(1);
                }
                resolve('combat done');
              });
            }, 2000);
          } else {
            this.handleDeath(2);
            resolve('combat done');
          }
        });
      } else {
        this.playAnimation(2, 'attack').then(() => {
          state = this.handleDamage(2, this.state);
          if (state.p1Team[state.p1Char].currentHp > 0) {
            setTimeout(() => {
              this.playAnimation(1, 'attack').then(() => {
                state = this.handleDamage(1, this.state);
                if (state.p2Team[state.p2Char].currentHp <= 0) {
                  this.handleDeath(2);
                }
              });
              resolve('combat done');
            }, 2000)
          } else {
            this.handleDeath(1);
            resolve('combat done');
          }
        });
      }
    })
  }

  handleDamage(player, state, damage) {
    // let effects = move.effects;
    let newState = Object.assign({}, state);
    let attacker, move, target;
    if (player === 1) {
      attacker = newState.p1Team[newState.p1Char];
      target = newState.p2Team[newState.p2Char];
      move = newState.p1Move;
    } else {
      attacker = newState.p2Team[newState.p2Char];
      target = newState.p1Team[newState.p1Char];
      move = newState.p2Move;
    }
    damage = damage || damageFormula(attacker, move, target);
    target.currentHp -= damage;
    this.setState(newState);
    return newState;
  }

  playAnimation(player, animation) {
    return new Promise((resolve, reject) => {
      if (player === 1) {
        let char = this.state.p1Team[this.state.p1Char];
        for (var i = 0; i <= char.animations[animation].frames; i++) {
          if (i === char.animations[animation].frames) {
            setTimeout(() => resolve('done'), (120 * i) + 300);
            this.resetP1(i);
          } else {
            this.animateP1(animation, i);
          }
        }
      } else if (player === 2) {
        let char = this.state.p2Team[this.state.p2Char];
        for (var j = 0; j <= char.animations[animation].frames; j++) {
          if (j === char.animations[animation].frames) {
            setTimeout(() => resolve('done'), (120 * j) + 300);
            this.resetP2(j);
          } else {
            this.animateP2(animation, j);
          }
        }
      }
    });
  }

  // playAnimation(player, animation) {
  //   if (player === 1) {
  //     let char = this.state.p1Team[this.state.p1Char];
  //     for (var i = 0; i <= char.animations[animation].frames; i++) {
  //       this.animateP1(animation, i);
  //     }
  //   } else {
  //     let char = this.state.p2Team[this.state.p2Char];
  //     for (var i = 0; i <= char.animations[animation].frames; i++) {
  //       this.animateP2(animation, i);
  //     }
  //   }
  // }

  animateP1(animation, frame) {
    setTimeout(() => {
      console.log('animation for player 1 ' + 'change at' + Date(Date.now()).toString() + 'to' + frame.toString());
      let newState = Object.assign({}, this.state);
      let character = newState.p1Team[newState.p1Char];
      character.imgUrl = character.animations[animation].path + frame.toString() + character.animations.filetype;
      this.setState(newState);
    }, 120 * frame);
  }

  resetP1(frame) {
    setTimeout(() => {
      console.log('animation for player 1 ' + 'change at' + Date(Date.now()).toString() + 'to' + ' reset');
      let newState = Object.assign({}, this.state);
      let character = newState.p1Team[newState.p1Char];
      character.imgUrl = character.animations.base + character.animations.filetype;
      this.setState(newState);
    }, (120 * frame) + 200);
  }

  animateP2(animation, frame) {
    setTimeout(() => {
      console.log('animation for player 2 ' + 'change at' + Date(Date.now()).toString() + 'to' + frame.toString());
      let newState = Object.assign({}, this.state);
      let character = newState.p2Team[newState.p2Char];
      character.imgUrl = character.animations[animation].path + frame.toString() + character.animations.filetype;
      this.setState(newState);
    }, 120 * frame);
  }

  resetP2(frame) {
    setTimeout(() => {
      console.log('animation for player 2 ' + 'change at' + Date(Date.now()).toString() + 'to' + ' reset');
      let newState = Object.assign({}, this.state);
      let character = newState.p2Team[newState.p2Char];
      character.imgUrl = character.animations.base + character.animations.filetype;
      this.setState(newState);
    }, (120 * frame) + 200);
  }

  handleDeath(player) {
    this.playAnimation(player, 'death').then(() => {
      let newState = Object.assign(this.state);
      if (player === 1) {
        if (newState.p1CanSwitch === false) alert('player 2 wins');
        else {
          newState.p1Char = newState.p1Char === 0 ? 1 : 0;
          newState.p1CanSwitch = false;
        }
      } else if (player === 2) {
        if (newState.p2CanSwitch === false) alert('player 1 wins');
        else {
          newState.p2Char = newState.p2Char === 0 ? 1 : 0;
          newState.p2CanSwitch = false;
        }
      }
      this.setState(newState);
    });
  }

  idle(frame1, frame2) {
    let newState = Object.assign({}, this.state);
    if (newState.charStates === 'idle') {
      let p1Character = newState.p1Team[newState.p1Char];
      let p2Character = newState.p2Team[newState.p2Char];
      p1Character.imgUrl = p1Character.animations.idle.path + frame1.toString() + p1Character.animations.filetype;
      p2Character.imgUrl = p2Character.animations.idle.path + frame2.toString() + p2Character.animations.filetype;
      this.setState(newState);
      let nextFrame1, nextFrame2;
      frame1 >= p1Character.animations.idle.frames ? nextFrame1 = 0 : nextFrame1 = frame1 + 1;
      frame2 >= p2Character.animations.idle.frames ? nextFrame2 = 0 : nextFrame2 = frame2 + 1;
      setTimeout(() => this.idle(nextFrame1, nextFrame2), 120);
    }
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
    // let team = this.state.team;
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
              {this.state[`p${this.state.p1 === this.currentUserId ? '1' : '2'}Team`][this.state.p1 === this.currentUserId ? this.state.p1Char : this.state.p2Char].movespool.map((move, i) => <li key={`move-${i}`}><button onClick={(e) => this.makeMove(move, this.state.p1 === this.currentUserId ? 1 : 2)}>{move.name}</button></li>)}
            </ul>
          </div>
          {((this.state.p1 === this.currentUserId && this.state.p1CanSwitch === true) || (this.state.p2 === this.currentUserId && this.state.p2CanSwitch === true)) ? <span id="switch-character"><button onClick={() => this.sendSwitch(playerNum)}>Switch</button></span> : <span id="switch-character"><button disabled>Switch</button></span>}
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
                <img src={this.state.p1Team[this.state.p1Char].imgUrl} className="game-character-img game-left" alt="char-p1" />
                <span id="p1-hp">{this.charHealthBar(this.state.p1Team[this.state.p1Char])}</span>
              </span>
              <span id="p2-side">
                <img src={this.state.p2Team[this.state.p2Char].imgUrl} className="game-character-img game-right" alt="char-p2" />
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

