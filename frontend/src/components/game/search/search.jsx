import React from 'react';
import { withRouter } from 'react-router-dom';

// const splashImg = './images/forest-bg.jpg'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: "",
      currentUserId: this.props.currentUser.user.id
      //,
      // loaded: false
    };
  }

  // componentDidMount() {
    // console.log('we here at search');
  // }

  update(field) {
    return e =>
      this.setState({
        [field]: e.currentTarget.value
      });
  }

  joinGame(e) {
    e.preventDefault();
    const gameId = document.getElementById('search-game-id').value
    this.props.fetchGame(gameId).then(res => {
      // console.dir(res);
      if (!res) alert('Game not found!');
      // else if (res.game.data.active === true) alert('Game started!');
      // else if (res.game.data.full === true) alert('Game started!');
      else {
        if (res.game.data.full === false) {
          const updatedGame = {
            host: res.game.data.host,
            p2: this.state.currentUserId,
            full: true,
            active: res.game.data.active
          }
          this.props.updateGame(res.game.data._id, updatedGame).then(data => this.props.history.push(`/game/play/${res.game.data._id}`));
        }
        else {
          this.props.history.push(`/game/play/${res.game.data._id}`); 
        }
        // this.props.history.push(`/game/play/${res.game.data._id}`);
      }
    });
  }

  createGame() {
    // console.dir(this.props.currentUser.user.id);
    const game = {
      host: this.state.currentUserId
    }
    this.props.createGame(game)
      .then(res => {
        // console.dir(res);
        this.props.history.push(`/game/play/${res.game.data._id}`)
      });
  }

  createAIGame() {
    const game = {
      host: this.state.currentUserId,
      p2: 'cpu-player'
    }
    this.props.createGame(game)
      .then(res => {
        // console.dir(res);
        this.props.history.push(`/game/play/${res.game.data._id}`)
      });
  }

  render() {
    return (
      <div id="game-lobby-div">
        <div id="game-lobby-content">
          <div id="game-lobby-title">
            Find a Game
          </div>
          <div id="game-lobby">
            <div id="game-search-create">
              <button onClick={() => this.createGame()} className="create-game">Play vs Friend</button>
              <button onClick={() => this.createAIGame()} className="create-game">Play vs AI</button>
            </div>

            <div id="game-search-join">
              <input type="text" value={this.state.gameId} onChange={this.update("gameId")} id="search-game-id" placeholder="Room ID"/>
              <input className="join-game-btn" type="submit" value="Join" onClick={(e) => this.joinGame(e)} />
            </div>

          </div>
        </div>

        {/* <div id="game-lobby-background">
          <img src={splashImg} alt="background" className="splash-image" />
        </div> */}
      </div>
    );
  }
}

export default withRouter(Search);
