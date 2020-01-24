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
      <div style={{marginTop: '30vh'}}id="game-div" height='600px' width='800px'>
        <Route exact path="/game" component={MainMenu} />
        {/* <Route path="/game/play" component={GamePlay} /> */}
        {/* <Route exact path="/edit" component={EditTeamContainer} /> */}
        {
        monsters.map(monster => {
          return(<li>
            <h2>{monster.name}</h2>
            <img src={monster.imageUrl} alt={monster.name}/>
          </li>)
        })
        }
      </div>
    )
  }
}