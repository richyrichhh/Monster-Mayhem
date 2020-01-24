import { getMonsters, getMonster } from '../util/monster_api_util';

export const RECEIVE_MONSTERS = "RECEIVE_MONSTERS";
export const RECEIVE_MONSTER = "RECEIVE_MONSTER";

export const receiveMonsters = monsters => ({
  type: RECEIVE_MONSTERS,
  monsters
});

export const receiveMonster = monster => ({
  type: RECEIVE_MONSTER,
  monster
});

export const fetchMonsters = () => dispatch => (
  getMonsters()
    .then(monsters => dispatch(receiveMonsters(monsters)))
    .catch(err => console.log(err))
);

export const fetchMonster = id => dispatch => (
  getMonster(id)
    .then(monster => dispatch(receiveMonster(monster)))
    .catch(err => console.log(err))
);

