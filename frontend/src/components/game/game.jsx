import React from 'react';
import GAME_PROPS from './game_constants';
import { Route } from 'react-router-dom';
const _ = require('underscore');

import MainMenu from './menus/main_menu';
import GamePlay from './play/play';
import EditTeamContainer from './menus/edit_team_container'

const CURRENT_USER_ID = 0;

export default class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (_.isEmpty(this.props.monsters)) this.props.fetchMonsters();
    if (_.isEmpty(this.props,teams)) this.props.fetchTeam(CURRENT_USER_ID);
  }

  render() {
    return (
      <div id="game-div" height={GAME_PROPS.GAME_HEIGHT} width={GAME_PROPS.GAME_WIDTH}>
        <Route exact path="/game" component={MainMenu} />
        <Route path="/game/play" component={GamePlay} />
        <Route exact path="/edit" component={EditTeamContainer} />
      </div>
    )
  }
}