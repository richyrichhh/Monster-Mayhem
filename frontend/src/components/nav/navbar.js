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
      const currentUsername = this.props.currentUser.username
      return (
        <div className="navbar-loggedin">
          <div className="nav-bar-greeting">Ready up, {currentUsername}!</div>

          <Link className="about-link" to={"/about"}>
            Meet the Devs
          </Link>

          <Link className="learn-to-link" to={"/learn"}>
            Learn To Play
          </Link>

          <div id="navbar-div-logout">
            <a className="logout-button" href="/" onClick={this.logoutUser}>
              Logout
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div id="navbar-div-inner">
          {/* <Link to={'/signup'}>Sign Up</Link>
          <Link to={'/login'}>Login</Link> */}
          <Link className="about-link" to={"/about"}>
            Meet the Devs
          </Link>
          <button onClick={() => this.props.openModal("signup")}>
            Sign Up
          </button>
          <button onClick={() => this.props.openModal("login")}>Login</button>
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