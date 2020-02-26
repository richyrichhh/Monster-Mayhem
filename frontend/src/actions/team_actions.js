import { getUserTeam, createTeam, updateTeam } from '../util/team_api_util';

export const RECEIVE_USER_TEAM = 'RECEIVE_USER_TEAM';
export const RECEIVE_NEW_TEAM = 'RECEIVE_NEW_TEAM';
export const RECEIVE_UPDATED_TEAM = 'RECEIVE_UPDATED_TEAM';
 
export const receiveUserTeam = team => ({
  type: RECEIVE_USER_TEAM,
  team
});

export const receiveNewTeam = team => ({
  type: RECEIVE_NEW_TEAM,
  team
})

export const receiveUpdatedTeam = team => ({
  type: RECEIVE_UPDATED_TEAM, 
  team 
})


export const fetchUserTeam = (userId) => dispatch => (
  getUserTeam(userId)
    .then(team => dispatch(receiveUserTeam(team)))
    .catch(err => console.log(err))
);

export const createNewTeam = (userId) => dispatch => (
  createTeam({id: userId})
    .then(team => dispatch(receiveNewTeam(team)))
    .catch(err => console.log(err))
);

export const updateUserTeam = (userId, data) => dispatch => (
  updateTeam(userId, data)
    .then(team => dispatch(receiveUpdatedTeam(team)))
    .catch(err => console.log(err))
);

