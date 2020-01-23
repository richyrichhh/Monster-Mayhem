import { RECEIVE_MONSTERS, RECEIVE_MONSTER } from '../actions/monster_actions';
  
  const MonstersReducer = (state = { monsters: {}, monster: {} }, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch(action.type) {
      case RECEIVE_MONSTERS:
        newState.monsters = action.monsters;
        return newState;
      case RECEIVE_MONSTER:
        newState.monster = action.monster;
        return newState;
      default:
        return state;
    }
  };
  
  export default MonstersReducer;