import axios from 'axios';

export const getMonsters = () => {
  return axios.get('/api/monsters')
};

export const getMonster = id => {
  return axios.get(`/api/monsters/${id}`)
};

