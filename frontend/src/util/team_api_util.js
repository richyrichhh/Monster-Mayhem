import axios from 'axios';

export const getUserTeam = id => {
  return axios.get(`/api/teams/user/${id}`)
};

export const createTeam = (id) => {
  // data.currentUserId = id;
  return axios.post('/api/teams/', id);
};

export const updateTeam = (id, data) => {
  return axios.patch(`/api/teams/user/${id}`, data)
};