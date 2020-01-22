import { connect } from 'react-redux';
import { fetchMonster, fetchMonsters } from '../../../actions/monsters';
import { fetchTeam } from '../../../actions/team';

import Game from './game';

const mapStateToProps = state => ({
  loggedIn: state.session.isAuthenticated,
  users: state.users,
  monsters: state.monsters,
  teams: state.teams
});

const mapDispatchToProps = dispatch => ({
  fetchMonsters: () => dispatch(fetchMonsters()),
  fetchMonster: (id) => dispatch(fetchMonster(id)),
  fetchTeam: (user_id) => dispatch(fetchTeam(user_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);