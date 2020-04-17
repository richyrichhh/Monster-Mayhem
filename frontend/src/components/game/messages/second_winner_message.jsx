import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class SecondWinnerMessage extends React.Component {
  // constructor(props) {
  //   super(props)

  // }

  render() {
    return (
      <div className="winner-container">
        <div className="winner-message">
          <p className="winner-title">
            GAME OVER
            <br/>
            Player 2 Wins
          </p>
          <Link to="/game/search" onClick={this.props.closeModal} className="winner-link">
            Return to Gameroom
          </Link>
        </div>
      </div>
    )
  }
}

export default withRouter(SecondWinnerMessage);