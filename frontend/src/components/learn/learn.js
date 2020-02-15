import React from 'react';


class Learn extends React.Component {

  render() {
    return (
      <div className="learn-div">
        <img className="learn-background" src="./images/forest-bg.jpg" />
        <div className="learn-title-container">
          <h1 className="learn-title">Learn How To Play Monster Mayhem</h1>
        </div>

        <div className="learn-info">
          <div className="learn-container">
            <p className="learn-description">
              Squad Up! <br />
              <br />
              Hover over a monster to reveal their abilities.
              <br />
              <br /> Select 2 monsters.
            </p>
            <img className="learn-image-1" src="./images/hover_char.jpg"></img>
          </div>

          <div className="learn-container">
            <img className="learn-image-1" src="./images/start_fight.jpg"></img>
            <p className="learn-description">Select Fight to begin!</p>
          </div>

          <div className="learn-container">
            <p className="learn-description">how is it going tonight yall</p>
            <img className="learn-image-1" src="./images/start_fight.jpg"></img>
          </div>

          <div className="learn-container">
            <p className="learn-description">how is it going tonight yall</p>
            <img className="learn-image-1" src="./images/start_fight.jpg"></img>
          </div>

          <div className="learn-container">
            <p className="learn-description">how is it going tonight yall</p>
            <img className="learn-image-1" src="./images/start_fight.jpg"></img>
          </div>

          <div className="learn-container">
            <p className="learn-description">how is it going tonight yall</p>
            <img className="learn-image-1" src="./images/start_fight.jpg"></img>
          </div>
        </div>
      </div>
    );
  }
}

export default Learn;