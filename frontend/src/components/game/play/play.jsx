import React from 'react';

export default class Play extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerNum: 1,
      playerChar: (this.props.playerNum === 1 ? this.props.characters[0][0] : characters[1][0]),
      playerSwitch: 0,
      oppChar: (this.props.playerNum === 1 ? this.props.characters[1][0] : characters[0][0])
    }
  }

  render() {
    return (
      <div id="gameplay-div">
        <span id="game-stage">
          <span>
            <span id="pc-side">
              <img src={this.state.playerChar.imgUrl}/>
              <span id="pc-hp"></span>
            </span>
            <span id="ec-side">
              <img src={this.state.oppChar.imgUrl}/>
              <span id="ec-hp"></span>
            </span>
          </span>
        </span>
        <div id="game-moves">
          <div id="character-moves"></div>
          <span id="switch-character"></span>
        </div>
      </div>
    )
  }
}

