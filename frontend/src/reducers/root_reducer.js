import { combineReducers } from 'redux';
import session from './session_api_reducer';
import errors from './errors_reducer';
import monsters from './monsters_reducer';
import team from './teams_reducer';
import game from './game_reducers';

const RootReducer = combineReducers({
  session,
  monsters,
  team,
  game,
  errors
});

export default RootReducer;