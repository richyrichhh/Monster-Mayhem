import React from 'react';

export default class Play extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerNum: 1,
      p1: this.props.players[0],
      p2: this.props.players[1],
      p1Char: this.props.characters[0][0],
      p2Char: this.props.characters[1][0],
      monsters: this.props.monsters,
      turn: 1
    }
  }

  switchTurn() {
    this.state.turn === 1 ? this.state.turn = 2 : this.state.turn = 1;
    let movesDiv = document.getElementById('game-moves');

    if(this.state.turn === this.state.playerNum) {
      movesDiv.addClass('your-turn');
      movesDiv.removeClass('not-your-turn');
    } else {
      movesDiv.addClass('not-your-turn');
      movesDiv.removeClass('your-turn');
    } 
  }

  lightUpChars() {
    let charSpan1 = document.getElementById('p1-side')
    let charSpan2 = document.getElementById('p2-side')
    if (this.turn === 1) {
      charSpan1.addClass('lit-up');
      charSpan2.removeClass('lit-up');
    } else {
      charSpan1.removeClass('lit-up');
      charSpan2.addClass('lit-up');
    }
  }


  render() {
    return (
      <div id="gameplay-div">
        <span id="game-stage">
          <span>
            <span id="p1-side" className="lit-up">
              <img src={this.state.p1Char.imgUrl}/>
              <span id="pc-hp"></span>
            </span>
            <span id="p2-side">
              <img src={this.state.p2Char.imgUrl}/>
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
    )
  }
}

