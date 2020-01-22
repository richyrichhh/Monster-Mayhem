import React from 'react';
const _ = require('underscore');

const currentUser = {
  id: 0
};

export default class EditTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: this.props.teams[currentUser.id],
      monsters: this.props.monsters
    }
  }

  componentDidMount() {
    if(_.isEmpty(this.state.team)) this.props.fetchTeam(currentUser.id).then(payload => this.setState({team: payload.team}));
    if(_.isEmpty(this.state.monsters)) this.props.fetchMonsters().then(payload => this.setState({monsters: payload.monsters}));
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
    const { team } = this.state;
    const { monsters } = this.state;
    return (
      <div id="edit-team-div">
        {team.map(monster => {(
          <form>
            <label>
              Monster:
              <select className="select-monster">
                {monsters.map( mon => {(
                  <option value={mon.name}>{mon.name}</option>
                )})}
              </select>
            </label>

            <label>
              Move 1:
              <select className="pick-move-1">
                {monster.moves.map( move => {(
                  <option value={move.name}>{move.name}</option>
                )})}
              </select>
            </label>
            <label>
              Move 2:
              <select className="pick-move-2">
                {monster.moves.map( move => {(
                  <option value={move.name}>{move.name}</option>
                )})}
              </select>
            </label>
            <label>
              Move 3:
              <select className="pick-move-3">
                {monster.moves.map( move => {(
                  <option value={move.name}>{move.name}</option>
                )})}
              </select>
            </label>
            <label>
              Move 4:
              <select className="pick-move-4">
                {monster.moves.map( move => {(
                  <option value={move.name}>{move.name}</option>
                )})}
              </select>
            </label>

            <input type="submit" value="Update Team"/>
          </form>
        )})}  
      </div>
    )
  }
}