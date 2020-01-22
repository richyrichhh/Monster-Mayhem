import { connect } from 'react-redux';
import { fetchTeam, updateTeam } from 'not-made-yet';

import Game from './game';

const mapStateToProps = state => ({
  loggedIn: state.session.isAuthenticated,
  users: state.users,
  monsters: state.monsters,
  teams: state.teams
});

const mapDispatchToProps = dispatch => ({
  updateTeam: (id) => dispatch(updateTeam(id)),
  fetchTeam: (user_id) => dispatch(fetchTeam(user_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);