import React from 'react';
const _ = require('underscore');

const currentUser = {
  id: 0
};

export default class EditTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: this.props.teams[currentUser.id]
    }
  }

  componentDidMount() {
    if(_.isEmpty(this.state.team)) this.props.fetchTeam(currentUser.id).then(payload => this.setState({team: payload.team}));
  }

  handleSubmit() {
    const team = this.state.team;
    this.props.updateTeam(team);
  }

  handleUpdate(i, prop, val) {
    let newState = Object.assign({}, this.state);
    Object.assign(newState.team[i], {[prop]: val})
    this.setState(newState);
  }

  render() {
    const { team } = this.state
    return (
      <div id="edit-team-div">
        {team.map(monster => {(
          <ul>
            <li>
              Monster:
            </li>

            <li>
              Moves:
            </li>
          </ul>
        )})}  
      </div>
    )
  }
}