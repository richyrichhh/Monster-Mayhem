import { connect } from 'react-redux';
import { fetchMonster, fetchMonsters } from '../../../src/actions/monster_actions';
import { fetchUserTeam, createNewTeam, updateUserTeam } from '../../actions/team_actions';
import { openModal } from '../../actions/modal_actions';

import Game from './game';

const mapStateToProps = state => ({
  loggedIn: state.session.isAuthenticated,
  user: state.session.user,
  monsters: Object.values(state.monsters),
  team: Object.values(state.team),
});

const mapDispatchToProps = dispatch => ({
  fetchMonsters: () => dispatch(fetchMonsters()),
  fetchMonster: (id) => dispatch(fetchMonster(id)),
  fetchTeam: (userId) => dispatch(fetchUserTeam(userId)), 
  createNewTeam: team => dispatch(createNewTeam(team)),
  updateUserTeam: (userId, team) => dispatch(updateUserTeam(userId, team)),
  openModal: () => dispatch(openModal('fight'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);