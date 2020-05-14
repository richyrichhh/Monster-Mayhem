import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class FightMessage extends React.Component {
  // constructor(props) {
  //   super(props)
    
  // }

  render() {
    return(
      <div className="fight-container">
        <div className="fight-message">
          <p className="fight-title">
            Ready Up!
            <br/>
            Click Fight to Begin
          </p>

          <Link to="/game/search" onClick={this.props.closeModal} className="fight-link">
            Fight
          </Link>
        </div>
      </div>
    )
  }
}

export default withRouter(FightMessage);