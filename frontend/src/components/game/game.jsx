import React from 'react';
// import GAME_PROPS from './game_constants';
import { Route } from 'react-router-dom';
import MainMenu from './menus/main_menu';
const _ = require('underscore');

// import GamePlay from './play/play';
// import EditTeamContainer from './menus/edit_team_container'

const CURRENT_USER_ID = 0;

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userTeam: [],
    }
    this.addToTeam = this.addToTeam.bind(this);
    this.team = [];
  };

  componentDidMount() {
    this.props.fetchMonsters();
    this.props.fetchTeam();
    this.props.createNewTeam(this.team);
  };

  addToTeam(e) {
    e.preventDefault();
    this.team.push(e.target.alt);
    this.setState({
      userTeam: this.team,
    })
    if (this.team.length === 2) {
      this.props.updateUserTeam(this.props.user.id, { team: this.team, user:this.props.user.id });
    };
  };

  render() {
    let monsters = this.props.monsters[0];
    if (!monsters) return null;

    if (!this.props.team) {
      return null;
    }

    let userTeam = []
    monsters.forEach(monster => {
      if(this.team.includes(monster.id)){
        userTeam.push(monster);
      }
    })

    console.log(userTeam)


    return (
      <div id='game-div'>
        {
          userTeam.map(monster => 
            <h2 className='test'>
              {monster.name}
            </h2>)
        }
        <div>
          <img id='game-page-background' src="https://wallpaperaccess.com/full/235857.jpg" />
          <Route exact path="/game" component={MainMenu} />
        </div>
        {/* <Route path="/game/play" component={GamePlay} /> */}
        {/* <Route exact path="/edit" component={EditTeamContainer} /> */}

        <h2>Please choose your team:</h2>
        <div className='monster-icon-div'>
          {
            monsters.map(monster => 
              <div onClick={this.addToTeam} className='monster-element'>
                {/* {monster.name} */}
                <img className='monster-icon' src={monster.imageUrl} alt={monster._id}/>
              </div>)
          }
        </div>
      </div>
    )
  }
}