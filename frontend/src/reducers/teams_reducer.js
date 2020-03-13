import { RECEIVE_USER_TEAM, RECEIVE_NEW_TEAM, RECEIVE_UPDATED_TEAM } from '../actions/team_actions';
  
  const TeamsReducer = (state = {}, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch(action.type) {
      case RECEIVE_USER_TEAM:
        newState.team = action.team;
        return newState;
      case RECEIVE_NEW_TEAM:
        newState.new = action.team.data
        return newState;
      case RECEIVE_UPDATED_TEAM:
        newState.update = action.team.data;
        return newState;
      default:
        return state;
    }
  };
  
  export default TeamsReducer;