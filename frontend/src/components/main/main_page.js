import React from 'react';

class MainPage extends React.Component {

  render() {
    return (
      <div id="splash-div">
        <div id="splash-img-div">
          <img src="https://wallpaperaccess.com/full/235857.jpg" />
        <div class="container">
          <p class="about"> 
            A multiplayer game
            <br/>
            <br />
            {/* still need to update with better font and description */}
            Combat game with classic horror film villains!
          </p>
        </div>
        </div>
        {/* <footer>
          Copyright &copy; 2019 Monster Mayhem
        </footer> */}
      </div>
    );
  }
}

export default MainPage;