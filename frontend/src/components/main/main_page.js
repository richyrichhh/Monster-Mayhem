import React from 'react';

class MainPage extends React.Component {

  render() {
    return (
      <div id="splash-div">
        {/* <div id="splash-img-div"> */}
        {/* <img className="splash-img" src="https://wallpaperaccess.com/full/235857.jpg" alt=""/> */}
          <div className="container">
            <p className="about"> 
              Hello, 
              <br/>
              You don't know me, but I know you.
              <br />
              I want to play a game...
              {/* still need to update with better font and description */}
              {/* Combat game with classic horror film villains! */}
            </p>
            <p>
              Come.
              <br />
              A multiplayer combat game with classic horror film villains.
            </p>
            <p>Choose your team and fight. 
              <br />
              There's only one winner.
            </p>
          </div>

        {/* </div> */}
        {/* <footer>
          Copyright &copy; 2019 Monster Mayhem
        </footer> */}
      </div>
    );
  }
}

export default MainPage;