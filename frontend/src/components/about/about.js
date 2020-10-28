import React from 'react';

class About extends React.Component {

  render() {
    return (
      <div className="about-div">
        <img className="about-background" src="./images/forest-bg.jpg" alt=""/>
        <div className="about-title-container">
          <h1 className="about-title">Meet The Monsters' Developers</h1>
        </div>

        <div className="dev-info">
          <div className="left-dev">
            <div className="dev-container">
              <img className="dev-image" src="./images/justin_fernandez.jpg" alt="" />
              <div className="dev-description">
                <h2>Justin Fernandez</h2>
                <br />
                <h3>Fullstack Developer</h3>
                <br />
                {/* oahfgaongouanoiuaznjoznvje */}
                <br />
                <br />
                <div className="icons">
                  <a
                    href="https://www.linkedin.com/in/justin-fernandez-7a4727122/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-linkedin-square"></i>
                  </a>
                  <a href="https://github.com/Justinlf55" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-github"></i>
                  </a>
                  <a href="https://angel.co/justin-fernandez-3" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-angellist"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="dev-container">
              <img className="dev-image" src="./images/chris_nguyen_2.jpg" alt=""/>
              <div className="dev-description">
                <h2>Chris Nguyen</h2>
                <br />
                <h3>Fullstack Developer</h3>
                <br />
                {/* oahfgaongouanoiua */}
                <br />
                <br />
                <div className="icons">
                  <a
                    href="https://www.linkedin.com/in/chris-nguyen-84b0261a1/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-linkedin-square"></i>
                  </a>
                  <a href="https://github.com/chrisdangnguyen" target=" _blank" rel="noopener noreferrer">
                    <i className="fa fa-github"></i>
                  </a>
                  <a href="https://angel.co/chris-nguyen-27" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-angellist"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="right-dev">
            <div className="dev-container">
              <img className="dev-image" src="./images/richard_lu.jpg" alt=""/>

              <div className="dev-description">
                <h2>Richard Lu</h2>
                <br />
                <h3>Fullstack Developer</h3>
                <br />
                {/* oahfgaongouanoiu */}
                <br />
                <br />
                <div className="icons">
                  <a
                    href="https://www.linkedin.com/in/richard-lu-7680271a1/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-linkedin-square"></i>
                  </a>
                  <a href="https://github.com/richyrichhh/" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-github"></i>
                  </a>
                  <a href="https://angel.co/richard-lu-6" target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-angellist"></i>
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default About;