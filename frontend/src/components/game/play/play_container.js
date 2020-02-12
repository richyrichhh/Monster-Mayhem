import { connect } from "react-redux";
import Play from "./play";
import { fetchGame, exitGame, updateCurrentGame } from '../../../actions/game_actions'
import { fetchMonsters } from '../../../actions/monster_actions';
import { fetchUserTeam } from '../../../actions/team_actions';



const mapStateToProps = state => {
  return {
    loggedIn: state.session.isAuthenticated,
    user: state.session.user,
    monsters: Object.values(state.monsters),
    team: Object.values(state.team)
  }
};

const mapDispatchToProps = dispatch => ({
  fetchMonsters: () => dispatch(fetchMonsters()),
  fetchTeam: (userId) => dispatch(fetchUserTeam(userId)),
  exitGame: (gameId) => dispatch(exitGame(gameId)),
  updateGame: (gameId, data) => dispatch(updateCurrentGame(gameId, data)),
  fetchGame: (gameId) => dispatch(fetchGame(gameId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Play);
