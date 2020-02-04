import axios from 'axios';

export const getUserTeam = id => {
  return axios.get(`/api/teams/user/${id}`)
};

export const createTeam = data => {
  return axios.post('/api/teams/', data)
};

export const updateTeam = (id, data) => {
  return axios.patch(`/api/teams/user/${id}`, data)
};