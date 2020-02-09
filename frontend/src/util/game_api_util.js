import axios from 'axios';

export const getGame = () => {
    return axios.get('/api/game')
};

export const createGame = data => {
    return axios.post('/api/game', data)
};

export const updateGame = (gameId, data) => {
    return axios.post(`/api/game/${gameId}`, data)
};

export const deleteGame = gameId => {
    return axios.delete(`/api/game/${gameId}`)
};