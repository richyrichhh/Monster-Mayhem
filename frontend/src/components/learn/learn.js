import React from 'react';


class Learn extends React.Component {

  render() {
    return (
      <div className="learn-div">
        <img className="learn-background" src="./images/forest-bg.jpg" alt=""/>
        <div className="learn-title-container">
          <h1 className="learn-title">Learn How To Play Monster Mayhem</h1>
        </div>

        <div className="learn-info">
          <div className="learn-container">
            <p className="learn-description">
              Squad Up <br />
              <br />
              Hover over a monster to reveal their abilities
              <br />
              <br /> Select 2 monsters
            </p>
            <img className="learn-image-1" src="./images/chooseteam.png" alt=""></img>
          </div>

          <div className="learn-container">
            <p className="learn-description">Select 'Fight' to begin</p>
            <img className="learn-image-1" src="./images/fight.png" alt=""></img>
          </div>

          <div className="learn-container">
            <p className="learn-description">Select on 'Create Game' to begin a new Game <br />
              <br />
              or <br />
              <br />
              Obtain a Room ID from an opponent and enter the Room ID 
              <br/>
              <br/>
              <br />
              Select 'Join' to begin the match

            </p>
            <img className="learn-image-1" src="./images/creategame.png" alt=""></img>
          </div>

          <div className="learn-container">
            <p className="learn-description">Use the Room ID from creating a new game to send to an opponent to join</p>
            <img className="learn-image-1" src="./images/joingame.png" alt=""></img>
          </div>

          <div className="learn-container">
            <p className="learn-description">
              Choose a move to strike your opponent per turn
              <br/>
              <br/>
              Depending on the move, each move can deliver damage and potentially poison, stun, or confuse your opponent
              <br />
              <br />
              Battle with a stratgic mind, select 'Switch' to switch out to a different monster
            </p>
            <img className="learn-image-1" src="./images/play_game.png" alt=""></img>
          </div>

          <div className="learn-container">
            <p className="learn-description">
              Remember to monitor the Monster's health
              <br />
              <br />
              Refer to the Combat Log for a history of damages and special effects
            </p>
            <img className="learn-image-1" src="./images/combatlog.png" alt=""></img>
          </div>

          <div className="learn-container">
            <p className="learn-description">
              Fight until the end when all monsters from a team are eliminated
              <br />
              <br />
              Only one Winner will survive
            </p>
            <img className="learn-image-1" src="./images/gameover.png" alt=""></img>
          </div>
        </div>
      </div>
    );
  }
}

export default Learn;