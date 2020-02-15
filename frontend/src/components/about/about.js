import React from 'react';

class About extends React.Component {

  render() {
    return (
      <div className="about-div">
        <img className="about-background" src="./images/forest-bg.jpg" />
        <div className="about-title-container">
          <h1 className="about-title">Meet The Monsters' Developers</h1>
        </div>

        <div className="dev-info">
          <div className="left-dev">
            <div className="dev-container">
              <p className="dev-description">
                <h2>Darryl Nguyen</h2>
                <br />
                <h3>Team Lead</h3>
                <br />
                oahfgaongouanoiuaznjoznvjealiaiuegoafuainviaoanfaozvhualfjafoiaj
              </p>
              <img className="dev-image-right" src="./images/darryl_nguyen.jpg" />
            </div>

            <div className="dev-container">
              <img className="dev-image-left" src="./images/richard_lu.jpg" />
              <p className="dev-description">
                <h2>Ricahrd Lu</h2>
                <br />
                <h3>Frontend Developer/Flex</h3>
                <br />
                oahfgaongouanoiuaznjoznvjealiaiuegoafuainviaoanfaozvhualfjafoiaj
              </p>
            </div>
          </div>

          <div className="right-dev">
            <div className="dev-container">
              <p className="dev-description">
                <h2>Justin Fernandez</h2>
                <br />
                <h3>Frontend Lead</h3>
                <br />
                oahfgaongouanoiuaznjoznvjealiaiuegoafuainviaoanfaozvhualfjafoiaj
              </p>
              <img className="dev-image-right" src="./images/justin_fernandez.jpg" />
            </div>

            <div className="dev-container">
              <img className="dev-image-left" src="./images/chris_nguyen.jpg" />
              <p className="dev-description">
                <h2>Chris Nguyen</h2>
                <br />
                <h3>Backend Lead/Flex</h3>
                <br />
                oahfgaongouanoiuaznjoznvjealiaiuegoafuainviaoanfaozvhualfjafoiaj
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default About;