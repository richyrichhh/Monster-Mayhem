import { getGame, createGame, updateGame, deleteGame } from '../util/game_api_util';

export const RECEIVE_GAME = 'RECEIVE_GAME';
export const RECEIVE_NEW_GAME = 'RECEIVE_NEW_GAME';
export const RECEIVE_UPDATED_GAME = 'RECEIVE_UPDATED_GAME';
export const DELETE_GAME = 'DELETE_GAME';

export const receiveGame = game => ({
    type: RECEIVE_GAME,
    game
});

export const receiveNewGame = game => ({
    type: RECEIVE_NEW_GAME, 
    game
});

export const receiveUpdatedGame = game => ({
    type: RECEIVE_UPDATED_GAME, 
    game
});

export const deleteCurrentGame = game => ({
    type: DELETE_GAME, 
    game
});

export const fetchGame = gameId => dispatch => (
    getGame(gameId)
        .then(gameId => dispatch(receiveGame(gameId)))
        .catch(err => console.log(err))
);

export const createNewGame = data => dispatch => (
    createGame(data)
        .then(game => dispatch(receiveNewGame(game)))
        .catch(err => console.log(err))
);

export const updateCurrentGame = (gameId, data) => dispatch => (
    updateGame(gameId, data)
        .then(game => dispatch(receiveUpdatedGame(game)))
        .catch(err => console.log(err))
);

export const exitGame = gameId => dispatch => (
    deleteGame(gameId)
        .then( () => dispatch(deleteCurrentGame(gameId)))
);