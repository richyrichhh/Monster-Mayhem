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
  }

  componentDidMount() {
    this.props.fetchMonsters();
    // if (_.isEmpty(this.props,teams)) this.props.fetchTeam(CURRENT_USER_ID);
  }

  render() {
    let monsters = this.props.monsters[0];
    if (!monsters) return null;

    return (
      <div id='game-div'>
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
              <div className='monster-element'>
                {/* {monster.name} */}
                <img className='monster-icon' src={monster.imageUrl} />
              </div>)
          }
        </div>
      </div>
    )
  }
}