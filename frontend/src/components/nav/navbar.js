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
          <a href="#" onClick={this.logoutUser}>Logout</a>
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
        <div className="navbar-title">
          <Link to="/"><h1 id="navbar-h1">Monster<br />Mayhem</h1></Link>
        </div>
        {this.getLinks()}
      </div>
    );
  }
}

export default NavBar;