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
      monsters: this.props.monsters
    }
  }

  render() {
    return (
      <div id="gameplay-div">
        <span id="game-stage">
          <span>
            <span id="p1-side">
              <img src={this.state.p1Char.imgUrl}/>
              <span id="pc-hp"></span>
            </span>
            <span id="p2-side">
              <img src={this.state.p2Char.imgUrl}/>
              <span id="ec-hp"></span>
            </span>
          </span>
        </span>
        <div id="game-moves">
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

