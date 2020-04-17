import React from 'react';
// import GAME_PROPS from './game_constants';
import { Route } from 'react-router-dom';
import MainMenu from './menus/main_menu';
import GameMonsterItem from './game_monster_item';
// const _ = require('underscore');

// import GamePlay from './play/play';
// import EditTeamContainer from './menus/edit_team_container'

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userTeam: [],
    }
    this.addToTeam = this.addToTeam.bind(this);
    this.team = [];
    this.currentUserId = this.props.user.id;
    // console.log(this.currentUserId);

    this.removeFromTeam = this.removeFromTeam.bind(this);
  };

  componentDidMount() {
    this.props.fetchMonsters();
    this.props.fetchTeam(this.currentUserId).then(data => data.team.data ? this.team = data.team.data.team : this.props.createNewTeam(this.currentUserId)); //data.team.data ? this.setState({userTeam: data.team.data}) : this.props.createNewTeam(this.currentUserId));
    // this.props.createNewTeam(this.team);
  };

  addToTeam(e) {
    e.preventDefault();

    if (this.team.length === 2) this.team.shift();

    if (e.target.alt) {
      this.team.push(e.target.alt);
      // console.log(e.target.alt)
    } else {
      this.team.push(e.target.title);
      // console.log(e.target.title);
    }

    this.setState({
      userTeam: this.team,
    })

    if (this.team.length === 2) {
      // alert('click fight to begin');
      // console.log(this.team);
      this.props.updateUserTeam(this.props.user.id, { team: this.team, user: this.props.user.id });
      this.props.openModal();
    };
  };

  removeFromTeam(e) {
    e.preventDefault();
    if (this.state.selected) {
      this.setState({
        selected: false
      })
    }
  }


  render() {
    let monsters = this.props.monsters[0];
    if (!monsters) return null;

    if (!this.props.team) {
      return null;
    }

    return (
      <div id='game-div'>
        <div>
          {/* <img id='game-page-background' src="https://wallpaperaccess.com/full/235857.jpg" alt="" /> */}
          <Route exact path="/game" component={MainMenu} />
        </div>
        {/* <Route path="/game/play" component={GamePlay} /> */}
        {/* <Route exact path="/edit" component={EditTeamContainer} /> */}

        <h2 id="game-select-title">Please select two characters:</h2>
        <div className='monster-icon-div'>
          {
            monsters.map((monster, index) => 
              <GameMonsterItem 
                addToTeam = {this.addToTeam}
                monster={monster}
                index={index}
                key={`monster${index}`}
              />
            )
          }
        </div>
      </div>
    )
  }
}