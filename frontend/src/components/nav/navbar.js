import React from 'react';
import { Link } from 'react-router-dom'

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.getLinks = this.getLinks.bind(this);
  }

  logoutUser(e) {
    e.preventDefault();
    this.props.logout();
  }

  getLinks() {
    if (this.props.loggedIn) {
      return (
        <div id="navbar-div-inner">
          <button onClick={this.logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div id="navbar-div-inner">
          <Link to={'/signup'}>Signup</Link>
          <Link to={'/login'}>Login</Link>
        </div>
      );
    }
  }

  render() {
    return (
      <div id="navbar-div">
        <h1 id="navbar-heading" className="slashed">
          <span className="top">
            Monster Mayhem
          </span>
          <span className="bot">
            Monster Mayhem
          </span>
        </h1>
        {this.getLinks()}
      </div>
    );
  }
}

export default NavBar;