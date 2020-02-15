import React from 'react';
import { withRouter } from 'react-router-dom';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    // this.renderErrors = this.renderErrors.bind(this);
    this.handleDemo = this.handleDemo.bind(this);
  }

  // Once the user has been authenticated, redirect to the Tweets page
  // componentWillReceiveProps(nextProps) {
  //   if (this.currentUser === true) {
  //     this.props.history.push("/tweets");
  //   }

  //   // Set or clear errors
  //   this.setState({ errors: nextProps.errors });
  // }

  // Handle field updates (called in the render method)

  componentDidMount() {

  }

  update(field) {
    return e =>
      this.setState({
        [field]: e.currentTarget.value
      });
  }

  // Handle form submission
  handleSubmit(e) {
    e.preventDefault();

    let user = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.login(user)
      .then(res => {
  
      if (!res.errors) {
    
        this.props.closeModal();
        this.props.history.push('/game');
  
      }
    });
  }

  // Render the session errors if there are any
  // renderErrors() {
  //   return (
  //     <ul>
  //       {Object.keys(this.state.errors).map((error, i) => (
  //         <li key={`error-${i}`}>{this.state.errors[error]}</li>
  //       ))}
  //     </ul>
  //   );
  // }

  demo(user) {
    const intervalSpeed = 50;
    const { username, password } = user;
    const demoUsernameTime = username.length * intervalSpeed;
    const demoPasswordTime = password.length * intervalSpeed;
    const buffer = intervalSpeed * 2;
    const totalDemoTime = demoUsernameTime + demoPasswordTime + buffer;
    this.demoUsername(username, intervalSpeed);
    setTimeout(() => this.demoPassword(password, intervalSpeed), demoUsernameTime);
    setTimeout(() => this.props.login(user), totalDemoTime);
    setTimeout(() => this.props.closeModal(), totalDemoTime + buffer);
    setTimeout(() => this.props.history.push("/game"), totalDemoTime + buffer);
  }

  demoUsername(username, intervalSpeed) {
    let i = 0;
    setInterval(() => {
      if (i <= username.length) {
        this.setState({ username: username.slice(0, i) });
        i++;
      } else {
        clearInterval();
      }
    }, intervalSpeed);
  }
  demoPassword(password, intervalSpeed) {
    let j = 0;
    setInterval(() => {
      if (j <= password.length) {
        this.setState({ password: password.slice(0, j) });
        j++;
      } else {
        clearInterval();
      }
    }, intervalSpeed);
  }

  handleDemo(e) {
    e.preventDefault();
    const user = Object.assign(
      {},
      {
        username: "Demo",
        password: "demo123"
      }
    );
    this.demo(user);
  }

  render() {
    return (
      <div className="session-form-div">
        <form onSubmit={this.handleSubmit}>
          <div className="session-form-top">
            <h3>Login</h3>
            <input
              type="text"
              value={this.state.username}
              onChange={this.update("username")}
              placeholder="Username"
            />
            <div className="login-errors">{this.props.errors.username}</div>
            <br />
            <input
              type="password"
              value={this.state.password}
              onChange={this.update("password")}
              placeholder="Password"
            />
            <div className="login-errors">{this.props.errors.password}</div>
          </div>
          <div className="demo">
            <button
              onClick={this.handleDemo}
              className="demobutton"
              id="demo-login"
            >
              Demo Login
            </button>
          </div>
          <div className="session-form-bot">
            <input type="submit" value="Submit" />
            {/* <span className="session-form-errors">{this.renderErrors()}</span> */}
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(LoginForm);
