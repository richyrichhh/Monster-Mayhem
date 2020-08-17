import React from 'react';
import io from 'socket.io-client';
import { monsterAnimations } from './monster_animations';
import { monsters } from './monsters';

// const path = require('path');

const $ = window.$;

const damageFormula = (monsterOne, move, monsterTwo) => {
  return Math.round(1.5 * monsterOne.attack * (move.strength) / monsterTwo.defense);
};

const switchMove = {
  name: 'switch',
  strength: 0,
  effect: 99,
  animation: 'none',
  hit: 'none'
}

const uselessMove = {
  name: '',
  strength: 0,
  effect: 0,
  animation: 'none',
  hit: 'none'
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

const effectsTable = {
  crossSlash: {
    path: './images/effects/cross-slash/tile-',
    frames: 16,
    filetype: '.png'
  },
  explosion: {
    path: './images/effects/explosion/tile-',
    frames: 16,
    filetype: '.png'
  },
  multiSlash: {
    path: './images/effects/multi-slash/tile-',
    frames: 40,
    filetype: '.png'
  },
  poisonBlast: {
    path: './images/effects/poison-blast/tile-',
    frames: 36,
    filetype: '.png'
  },
  strike: {
    path: './images/effects/strike/tile-',
    frames: 16,
    filetype: '.png'
  },
  none: {
    path: './images/effects/none/tile-',
    frames: 1,
    filetype: '.png'
  },
  base: './images/effects/none/tile-0.png'
};

const debuffTable = [[], 'confused', 'poisoned', 'stunned', 'wounded']

let p1TestTeam = [Object.assign({}, testMonster), Object.assign({}, testMonster2)]
let p2TestTeam = [Object.assign({}, testMonster), Object.assign({}, testMonster2)]

class Play extends React.Component {
  constructor(props) {
    super(props);
    this.gameId = this.props.match.params.gameId;
    this.currentUserId = this.props.user.id;
    // console.dir(this.props.user);
    this.socket = process.env.NODE_ENV === 'production' ? io() : io('http://localhost:5000')

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
      p1Effect: effectsTable.none.path + '0' + effectsTable.none.filetype,
      p1CanSwitch: true,
      p2Moved: false,
      p2Move: null,
      p2Effect: effectsTable.none.path + '0' + effectsTable.none.filetype,
      p2CanSwitch: true,
      refresh: false,
      loaded: false,
      turn: 0,
      log: []
    }

    window.state = this.state;
    window.currentUserId = this.currentUserId;
    
    this.turn = false;
    this.initializeGame = this.initializeGame.bind(this);
    this.makeMove = this.makeMove.bind(this);
    this.socket.emit("sendJoinRoomToBack", {
      gameId: this.gameId,
      userId: this.currentUserId
    });
  }

  componentDidMount() {
    const game = this.props.fetchGame(this.gameId)
      .then((game) => this.initializeGame(game));
    const sockets = this.initializeSocketListeners();
    
    Promise.all([game, sockets]).then(() => {
      if (this.state.p1 && this.state.p2) {
        setTimeout(() => {
          this.setState({loaded: true});
          this.idle(0, 0);
          // setTimeout(() => {
          // }, 1000);
          let bgm = document.getElementById('bgm');
          bgm.volume = 0.4;
          bgm.loop = true;
          bgm.play();
          this.socket.emit('checkStates', this.gameId);
        }, 2000)
      }
      // teams && this.game ? this.setState({ loaded: true }) : "";
    })
  }

  componentDidUpdate() {
    if (this.state.refresh) {
      this.refresh();
    }
    if (this.state.log.length > 0 && this.state.turn > 0) {
      let gameLogs = document.getElementById('game-logs'); 
      let xH = gameLogs.scrollHeight;
      gameLogs.scrollTo(0, xH);
    }
  }

  initializeGame(data) {
    this.game = data.game.data;
    if (!this.game.p2 && !this.state.loaded) {
      let page = document.getElementsByClassName('loading-page');
      page[0].className += ' type2';
    }
    let newState = Object.assign({}, this.state);
    newState.p1 = this.game.host;
    newState.p2 = this.game.p2;
    newState.turn += 1;
    this.setState(newState);
    this.monsters = {};
    let p1load, p2load;
    // this.loadEffects();
    // this.props.fetchMonsters().then(data => {
      // for (let monster of data.monsters.data) {
      //   this.monsters[monster._id] = monster;
      //   // this.loadAnim(monster);
      // }
      this.monsters = monsters;
      // console.dir(this.monsters);
      p1load = this.props.fetchTeam(this.game.host).then(data => {
        // console.dir(data.team.data.team)
        let p1Team = data.team.data.team.map(id => {
          let monster = Object.assign({}, this.monsters[id]);
          monster = this.fixMonster(monster);
          // console.log(monster);
          return monster;
        })
        return p1Team;
      });
      p2load = (this.game.p2) ? this.props.fetchTeam(this.game.p2).then(data => {
        if (this.game.p2 === 'cpu-player') return [this.fixMonster(Object.assign({}, Object.values(this.monsters)[Math.floor(Math.random() * 4)])), this.fixMonster(Object.assign({}, Object.values(this.monsters)[Math.floor(Math.random() * 4)]))];
        // console.log('p2 is' + this.game.p2);
        // console.dir(data.team.data.team)
        let p2Team = data.team.data.team.map(id => {
          let monster = Object.assign({}, this.monsters[id]);
          monster = this.fixMonster(monster);
          return monster;
          // console.log(monster);
        })
        return p2Team;
      }) : null;

      Promise.all([p1load, p2load]).then((data) => {
        // console.dir(data);
        let state = Object.assign({}, this.state);
        state.p1Team = data[0];
        state.p2Team = data[1];
        this.setState(state);
        state.log.push(`----------------------`)
        state.log.push(`Turn 1!`);
        state.log.push(`----------------------`)
        // teams && this.game ? this.setState({ loaded: true }) : "";
      })
    // });


    // console.log(newState);
    
    // console.dir(this.state);
  }

  preloadImages() {
    if (this.paths) {

    } else {
      this.paths = [];
      for (let effect of Object.values(effectsTable)) {
        for (let i = 0; i < effect.frames; i++) {
          this.paths.push(`${effect.path}${i}${effect.filetype}`);
          // c++;
          // console.log(c);
        }
      }

      for (let animSet of Object.values(monsterAnimations)) {
        for (let key of Object.keys(animSet)) {
          if (key !== 'base' && key !== 'filetype' && key !== 'none') {
            for (let i = 0; i < animSet[key].frames; i++) {
              this.paths.push(`${animSet[key].path}${i}${animSet.filetype}`);
              // c++;
              // console.log(c);
            }
          }
        }
      }
    }

    return (
      <div style={{display: 'none'}}>
        <img width="1" height="1" src="./images/loading.jpg" alt="preload-loading" />
        {this.paths.map((path, i) => <img width="1" height="1" src={path} alt={`preload${i}`} />)}
      </div>
    )
  }

  loadAnim(monster) {
    for (let key of Object.keys(monster.animations)) {
      if (key !== 'base' && key !== 'filetype' && key !== 'none') {
        for (let i = 0; i < monster.animations[key].frames; i++) {
          new Image().src = `${monster.animations[key].path}${i}${monster.animations.filetype}`;
        }
      }
    }
  }

  loadEffects() {
    for (let effect of Object.values(effectsTable)) {
      for (let i = 0; i < effect.frames; i++) {
        new Image().src = `${effect.path}${i}${effect.filetype}`;
      }
    }
  }

  fixMonster(monster) {
    // monster.animations = monsterAnimations[monster.name]
    // console.log(monsterAnimations["Jason Voorhees"]);
    monster.imgUrl = monster.animations.base + monster.animations.filetype;
    monster.currentHp = monster.health;
    monster.maxHp = monster.health;
    monster.animations.none = {
      path: monster.animations.base,
      frames: 1
    }
    monster.effects = [0, 0, 0, 0, 0]
    
    return monster;
  }

  initializeSocketListeners() {
    this.socket.on("startGame", (data) => {
      // console.log('starting game');
      window.location.reload(false);
      // this.componentDidMount();
    });

    this.socket.on("askForStates", () => {
      this.socket.emit('sendingBackStates', {state: this.state, gameId: this.gameId});
    });

    this.socket.on("receivingState", (state) => (state.turn > this.state.turn) ? this.setState(state) : "");

    this.socket.on("makeMove", (data) => {
      // console.log('making move');
      let newState = Object.assign({}, this.state);
      if (data.player === 1) {
        newState.p1Move = data.move;
        newState.p1Moved = true;
      } else if (data.player === 2) {
        newState.p2Move = data.move;
        newState.p2Moved = true;
      }
      if (this.state.p2 === 'cpu-player') {
        newState.p2Move = this.state.p2Team[this.state.p2Char].movespool[Math.floor(Math.random() * 4)];
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
        this.randInts = data.randInts;
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
              // console.log('turn is ending');
              this.turn = false;
              newState.p1Moved = false;
              newState.p2Moved = false;
              newState.p1Move = null;
              newState.p2Move = null;
              newState.charStates = 'idle';
              newState.refresh = true;
              setTimeout(() => {
                newState.log.push(`----------------------`)
                newState.log.push(`Turn ${newState.turn}!`);
                newState.log.push(`----------------------`)
                newState = this.handleEffects(newState);
                this.setState(newState)
                this.idle(0, 0);
              }, 500);
            }, 1000);
          })));
        // newState = this.handleSwitch(newState);
        // newState = this.handleCombat(newState);

      }
    });
  }

  prepTurn(data) {
    return new Promise((resolve, reject) => {
      let newState = Object.assign({}, this.state);
      // newState = Object.assign(newState, { p1Move: data.p1Move, p1Moved: true, p2Move: data.p2Move, p2Moved: true })
      if (data.p1Move) {
        newState.p1Move = data.p1Move;
      } else { 
        // console.log('ERROR IN P1MOVE');
        newState.p1Move = uselessMove;
      }
      newState.p1Moved = true;
      if (data.p2Move) {
        newState.p2Move = data.p2Move;
      } else {
        // console.log('ERROR IN P2MOVE');
        newState.p2Move = uselessMove;
      }
      newState.p2Moved = true;
      newState.turn += 1;
      newState.charStates = 'battle'
      this.setState(newState);
      resolve(newState);
    })
  }

  handleSwitch(state) {
    return new Promise((resolve, reject) => {
      if (state.p1Move.effect === 99) state.p1Char = state.p1Char === 0 ? 1 : 0;
      if (state.p2Move.effect === 99) state.p2Char = state.p2Char === 0 ? 1 : 0;

      state = this.handleConfusion(state);
      state = this.handleStun(state);
      
      this.setState(state);
      resolve(state);
    })
  }

  handleConfusion(state) {
    let randInt;
    if (state.p1Team[state.p1Char].effects[1] > 0) {
      randInt = this.randInts.shift();
      if (randInt >= 7) {
        state.p1Team[state.p1Char].currentHp -= 25;
        state.p1Move = uselessMove;
        state.log.push(`${state.p1Team[state.p1Char].name} is confused and hurt himself in his confusion!`);
      }
    }
    if (state.p2Team[state.p2Char].effects[1] > 0) {
      randInt = this.randInts.shift();
      if (randInt >= 7) {
        state.p2Team[state.p2Char].currentHp -= 25;
        state.p2Move = uselessMove;
        state.log.push(`${state.p2Team[state.p2Char].name} is confused and hurt himself in his confusion!`);
      }
    }
    this.setState(state);
    return state;
  }

  handleStun(state, player) {
    switch(player) {
      case 1:
        if (state.p1Team[state.p1Char].effects[3] > 0) {
          state.p1Move = uselessMove;
          state.log.push(`${state.p1Team[state.p1Char].name} is stunned and can't act!`);
          state.p1Team[state.p1Char].effects[3] -= 1;
        }
        break;
      case 2:
        if (state.p2Team[state.p2Char].effects[3] > 0) {
          state.p2Move = uselessMove;
          state.log.push(`${state.p2Team[state.p2Char].name} is stunned and can't act!`);
          state.p2Team[state.p2Char].effects[3] -= 1;
        }
        break;
      default:
    }
    this.setState(state);
    return state;
  }

  handleCombat(state) {
    return new Promise((resolve, reject) => {
      let effSpd1 = state.p1Team[state.p1Char].speed;
      let effSpd2 = state.p2Team[state.p2Char].speed;
      if (effSpd1 === effSpd2) {
        let rand = this.randInts.shift();
        if (rand < 5) {
          effSpd1 += 1;
        } else {
          effSpd2 += 1;
        }
      }
      if (effSpd1 > effSpd2) {
        state = this.handleStun(state, 1);
        this.playAnimation(1, state.p1Move.animation || 'none').then(() => this.playEffect(2, state.p1Move.hit).then(() => {
          state = this.handleDamage(1, this.state);
          if (state.p2Team[state.p2Char].currentHp > 0) {
            setTimeout(() => {
              state = this.handleStun(state, 2);
              this.playAnimation(2, state.p2Move.animation || 'none').then(() => this.playEffect(1, state.p2Move.hit).then(() => {
                state = this.handleDamage(2, this.state);
                if (state.p1Team[state.p1Char].currentHp <= 0) {
                  this.handleDeath(1);
                }
                setTimeout(() => resolve('combat done'), 500);
              }));
            }, 2000);
          } else {
            this.handleDeath(2);
            setTimeout(() => resolve('combat done'), 500);
          }
        }));
      } else {
        state = this.handleStun(state, 2);
        this.playAnimation(2, state.p2Move.animation || 'attack').then(() => this.playEffect(1, state.p2Move.hit).then(() => {
          state = this.handleDamage(2, this.state);
          if (state.p1Team[state.p1Char].currentHp > 0) {
            setTimeout(() => {
              state = this.handleStun(state, 1);
              this.playAnimation(1, state.p1Move.animation || 'attack').then(() => this.playEffect(2, state.p1Move.hit).then(() => {
                state = this.handleDamage(1, this.state);
                if (state.p2Team[state.p2Char].currentHp <= 0) {
                  this.handleDeath(2);
                }
                setTimeout(() => resolve('combat done'), 500);
              }));
            }, 2000);
          } else {
            this.handleDeath(1);
            setTimeout(() => resolve('combat done'), 500);
          }
        }));
      }
    })
  }

  handleDamage(player, state, damage) {
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
    let effect = move.effect;
    damage = damage || damageFormula(attacker, move, target);
    target.currentHp -= damage;
    if (damage > 0) newState.log.push(`${attacker.name}'s ${move.name} dealt ${damage} damage to ${target.name}.`);
    if (effect > 0 && effect < 99) {
      let turns = 0;
      switch (effect) {
        case 1:
          turns = 3;
          break;
        case 2:
          turns = 4;
          break;
        case 3:
          let randInt = this.randInts.shift();
          if (randInt >= 3) turns = 1;
          break;
        case 4:
          turns = 4;
          break;
        default:
      }
      target.effects[effect] = turns;
      if (turns > 0) newState.log.push(`${target.name} is ${debuffTable[effect]} for ${turns >= 2 ? turns - 1 : turns} ${turns > 2 ? 'turns' : 'turn'} by ${attacker.name}'s ${move.name}.`)
    }
    this.setState(newState);
    return newState;
  }

  playAnimation(player, animation) {
    if (player === 1) {
      return new Promise((resolve, reject) => {
        $(document.getElementsByClassName('game-left')[0]).addClass('moving');
        let char = this.state.p1Team[this.state.p1Char];
        for (let i = 0; i < char.animations[animation].frames; i++) {
          if (i === char.animations[animation].frames - 1) {
            setTimeout(() => resolve('done'), (60 * i) + 300);
            this.animateP1(animation, i);
            this.resetP1(i + 1);
          } else {
            this.animateP1(animation, i);
          }
        }
      });
    } else if (player === 2) {
      return new Promise((resolve, reject) => {
        $(document.getElementsByClassName('game-right')[0]).addClass('moving');
        let char = this.state.p2Team[this.state.p2Char];
        for (let j = 0; j < char.animations[animation].frames; j++) {
          if (j === char.animations[animation].frames - 1) {
            setTimeout(() => resolve('done'), (60 * j) + 300);
            this.animateP2(animation, j);
            this.resetP2(j + 1);
          } else {
            this.animateP2(animation, j);
          }
        }
      });
    }
  }

  animateP1(animation, frame) {
    setTimeout(() => {
      // console.log('animation for player 1 ' + 'change at' + Date(Date.now()).toString() + 'to' + frame.toString());
      let newState = Object.assign({}, this.state);
      let character = newState.p1Team[newState.p1Char];
      character.imgUrl = character.animations[animation].path + frame.toString() + character.animations.filetype;
      this.setState(newState);
    }, 60 * frame);
  }

  resetP1(frame) {
    setTimeout(() => {
      // console.log('animation for player 1 ' + 'change at' + Date(Date.now()).toString() + 'to' + ' reset');
      let newState = Object.assign({}, this.state);
      let character = newState.p1Team[newState.p1Char];
      character.imgUrl = character.animations.base + character.animations.filetype;
      $(document.getElementsByClassName('game-left')[0]).removeClass('moving');
      this.setState(newState);
    }, (60 * frame));
  }

  animateP2(animation, frame) {
    setTimeout(() => {
      // console.log('animation for player 2 ' + 'change at' + Date(Date.now()).toString() + 'to' + frame.toString());
      let newState = Object.assign({}, this.state);
      let character = newState.p2Team[newState.p2Char];
      character.imgUrl = character.animations[animation].path + frame.toString() + character.animations.filetype;
      this.setState(newState);
    }, 60 * frame);
  }

  resetP2(frame) {
    setTimeout(() => {
      // console.log('animation for player 2 ' + 'change at' + Date(Date.now()).toString() + 'to' + ' reset');
      let newState = Object.assign({}, this.state);
      let character = newState.p2Team[newState.p2Char];
      character.imgUrl = character.animations.base + character.animations.filetype;
      $(document.getElementsByClassName('game-right')[0]).removeClass('moving');
      this.setState(newState);
    }, (60 * frame));
  }

  playEffect(player, effect) {
    return new Promise((resolve, reject) => {
      if (player === 1) {
        // $(document.getElementById('effect-img-left')).addClass('moving');
        for (let i = 0; i < effectsTable[effect].frames; i++) {
          if (i === effectsTable[effect].frames - 1) {
            setTimeout(() => resolve('done'), (60 * i) + 300);
            this.animateEffectP1(effect, i);
            this.resetEffectP1(i + 1);
          } else {
            this.animateEffectP1(effect, i);
          }
        }
      } else if (player === 2) {
        // $(document.getElementById('effect-img-right')).addClass('moving');
        for (let j = 0; j < effectsTable[effect].frames; j++) {
          if (j === effectsTable[effect].frames - 1) {
            setTimeout(() => resolve('done'), (60 * j) + 300);
            this.animateEffectP2(effect, j);
            this.resetEffectP2(j + 1);
          } else {
            this.animateEffectP2(effect, j);
          }
        }
      }
    });
  }

  animateEffectP1(effect, frame) {
    setTimeout(() => {
      // console.log('effect for player 1 ' + 'change at' + Date(Date.now()).toString() + 'to' + frame.toString());
      let newState = Object.assign({}, this.state);
      newState.p1Effect = effectsTable[effect].path + frame.toString() + effectsTable[effect].filetype;
      this.setState(newState);
    }, 60 * frame);
  }

  resetEffectP1(frame) {
    setTimeout(() => {
      // console.log('effect for player 1 ' + 'change at' + Date(Date.now()).toString() + 'to' + ' reset');
      let newState = Object.assign({}, this.state);
      newState.p1Effect = effectsTable.base;
      // $(document.getElementById('effect-img-left')).removeClass('moving');
      this.setState(newState);
    }, (60 * frame));
  }

  animateEffectP2(effect, frame) {
    setTimeout(() => {
      // console.log('effect for player 2 ' + 'change at' + Date(Date.now()).toString() + 'to' + frame.toString());
      let newState = Object.assign({}, this.state);
      newState.p2Effect = effectsTable[effect].path + frame.toString() + effectsTable[effect].filetype;
      this.setState(newState);
    }, 60 * frame);
  }

  resetEffectP2(frame) {
    setTimeout(() => {
      // console.log('effect for player 2 ' + 'change at' + Date(Date.now()).toString() + 'to' + ' reset');
      let newState = Object.assign({}, this.state);
      newState.p2Effect = effectsTable.base;
      // $(document.getElementById('effect-img-right')).removeClass('moving');
      this.setState(newState);
    }, (60 * frame));
  }

  handleEffects(state) {
    let p1Char = state.p1Team[state.p1Char];
    let p2Char = state.p2Team[state.p2Char];
    let damage;
    if (p1Char.effects[2] > 0) {
      damage = Math.floor(p1Char.maxHp / 10);
      p1Char.currentHp -= damage;
      state.log.push(`${p1Char.name} takes ${damage} damage from poison.`)
    }
    if (p2Char.effects[2] > 0) {
      damage = Math.floor(p2Char.maxHp / 10);
      p2Char.currentHp -= damage;
      state.log.push(`${p2Char.name} takes ${damage} damage from poison.`)
    }
    if (p1Char.effects[4] > 0) {
      damage = Math.floor(p1Char.currentHp / 5);
      p1Char.currentHp -= damage;
      state.log.push(`${p1Char.name} takes ${damage} damage from bleeding.`)
    }
    if (p2Char.effects[4] > 0) {
      damage = Math.floor(p2Char.currentHp / 5);
      p2Char.currentHp -= damage;
      state.log.push(`${p2Char.name} takes ${damage} damage from bleeding.`)
    }
    // p1Char.effects = p1Char.effects.map((n, i) => {
    //   if (n > 0 && i !== 3) return n -= 1;
    //   else return n;
    // })
    if (p1Char.effects[1] > 0) p1Char.effects[1] -= 1;
    if (p1Char.effects[2]) p1Char.effects[2] -= 1;
    if (p1Char.effects[4]) p1Char.effects[4] -= 1;
    if (p1Char.effects[5]) p1Char.effects[5] -= 1;
    if (p2Char.effects[1]) p2Char.effects[1] -= 1;
    if (p2Char.effects[2]) p2Char.effects[2] -= 1;
    if (p2Char.effects[4]) p2Char.effects[4] -= 1;
    if (p2Char.effects[5]) p2Char.effects[5] -= 1;
    // p2Char.effects = p2Char.effects.map((o, ind) => {
    //   if (o > 0 && ind !== 3) o -= 1;
    // })

    return state;
  }

  handleDeath(player) {
    this.playAnimation(player, 'death').then(() => {
      let newState = Object.assign(this.state);
      if (player === 1) {
        if (newState.p1CanSwitch === false) {
          this.props.secondWinnerModal();
        // alert('player 2 wins');
        }
        else {
          newState.p1Char = newState.p1Char === 0 ? 1 : 0;
          newState.p1CanSwitch = false;
        }
      } else if (player === 2) {
        if (newState.p2CanSwitch === false) {
          this.props.firstWinnerModal();
        }
        // alert('player 1 wins');
        else {
          newState.p2Char = newState.p2Char === 0 ? 1 : 0;
          newState.p2CanSwitch = false;
        }
      }
      this.setState(newState);
    });
    // this.history.push("/game")
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
      frame1 === p1Character.animations.idle.frames - 1 ? nextFrame1 = 0 : nextFrame1 = frame1 + 1;
      frame2 === p2Character.animations.idle.frames - 1 ? nextFrame2 = 0 : nextFrame2 = frame2 + 1;
      setTimeout(() => this.idle(nextFrame1, nextFrame2), 120);
    }
  }

  makeMove(move, player) {
    // console.log('clicked makemove');
    // console.log(`${move} ${player}`);
    this.socket.emit('sendMoveToBack', { move: move, player: player, gameId: this.gameId });
  }

  sendSwitch(player) {
    // console.log('clicked switch');
    this.socket.emit('sendMoveToBack', { move: switchMove, player: player, gameId: this.gameId })
  }

  charHealthBar(character) {
    let healthPct = character.currentHp / character.maxHp;
    let bar = "";

    for (var x = 0; x < Math.floor(character.currentHp / 5); x++) {
      bar += "|"
    }
    if (healthPct < 0.3) {
        return <span className="healthbar danger-health">{bar}</span>;
        // return <span className="healthbar danger-health">{character.currentHp} / {character.maxHp}</span>;
    } else if (healthPct < 0.5) {
        // return <span className="healthbar warning-health">{character.currentHp} / {character.maxHp}</span>;

        return <span className="healthbar warning-health">{bar}</span>;
    } else {
      // return <span className="healthbar safe-health">{character.currentHp} / {character.maxHp}</span>;
      return <span className="healthbar safe-health">{bar}</span>;
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
          <h3>Pick your move:</h3>
          <div id="character-moves">
            <ul id="character-moves-list">
              {this.state[`p${this.state.p1 === this.currentUserId ? '1' : '2'}Team`][this.state.p1 === this.currentUserId ? this.state.p1Char : this.state.p2Char].movespool.map((move, i) => <li key={`move-${i}`}><button onClick={(e) => this.makeMove(move, this.state.p1 === this.currentUserId ? 1 : 2)}>{move.name}</button></li>)}
            </ul>
          </div>
          {((this.state.p1 === this.currentUserId && this.state.p1CanSwitch === true) || (this.state.p2 === this.currentUserId && this.state.p2CanSwitch === true)) ? <span id="switch-character"><button className="switch-button" onClick={() => this.sendSwitch(playerNum)}>Tag Out</button></span> : <span id="switch-character"><button disabled>Tag Out</button></span>}
        </div>
      )
    } else {
      return (
        <div id="game-moves">
          <div id="character-moves">
            <ul id="character-moves-list">
              <p className="waiting-icon">Waiting...</p>
            </ul>
          </div>
        </div>
      )
    }
  }

  renderLogs() {
    const logs = this.state.log;
    return (
      <div id="game-logs-div">
        <ul name="game-logs" id="game-logs" cols="100" rows="10">
          {logs.map((line, i) => <li key={`l${i}`}>{line}</li>)}
        </ul>

      </div>
    )
  }
  

  render() {
    let roomId;
    if (this.gameId === 'undefined'){
      roomId = 'No Current Room'
    } else {
      roomId = this.gameId;
    }

    if (this.state.loaded) {
      return (
        <div id="gameplay-div">
          <div id="gameplay-header">
            Room ID: <span>{roomId}</span>
          </div>
          <div id="play-background">
            <div>
              <span id="p1-side" className="lit-up">
                <img src={this.state.p1Team[this.state.p1Char].imgUrl} className="game-character-img game-left" alt="char-p1" />
                <img src={this.state.p1Effect} id="effect-img-left" className="effect-img" alt="effect-p1" />
                <span id="p1-hp">{this.charHealthBar(this.state.p1Team[this.state.p1Char])}</span>
              </span>
              <span id="p2-side">
                <img src={this.state.p2Team[this.state.p2Char].imgUrl} className="game-character-img game-right" alt="char-p2" />
                <img src={this.state.p2Effect} id="effect-img-right" className="effect-img" alt="effect-p2" />
                <span id="p2-hp">{this.charHealthBar(this.state.p2Team[this.state.p2Char])}</span>
              </span>
            </div>

          </div>
          <div className="moves-container">
            {this.renderMoves()}
            {this.renderLogs()}
          </div>


          <div id="preload-div" style={{display: 'none', width: '0px', height: '0px'}}>  
            {this.preloadImages()}
          </div>

          <audio id="bgm">
            <source src="./black_banquet.mp3"></source>
          </audio>
        </div>
      );
    } else {
      return (
      <div className="loading-page">
        <div id="gameplay-header">
          Room ID: <span>{roomId}</span>
        </div>
        <div id="preload-div" style={{ display: 'none', width: '0px', height: '0px' }}>
          {this.preloadImages()}
        </div>
        {/* <img src='./images/loading.jpg' alt="loading"/> */}
      </div>
      );
    }
  }
}


export default Play;

