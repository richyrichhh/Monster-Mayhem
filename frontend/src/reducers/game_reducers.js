import { RECEIVE_GAME, RECEIVE_UPDATED_GAME, DELETE_GAME, RECEIVE_NEW_GAME} from '../actions/game_actions';

const GameReducer = (state = {}, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch(action.type) {
        case RECEIVE_GAME:
            newState[action.game.data._id] = action.game.data;
            return newState;
        case RECEIVE_NEW_GAME:
            newState[action.game.data._id] = action.game.data;
            return newState;
        case RECEIVE_UPDATED_GAME:
            newState[action.game.data._id] = action.game.data;
            return newState;
        case DELETE_GAME:
            delete newState.gameId;
            return newState;
        default:
            return state;
    }
};

export default GameReducer;