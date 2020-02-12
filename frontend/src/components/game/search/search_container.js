import { connect } from "react-redux";
import Search from "./search";
import { fetchMonsters } from '../../../actions/monster_actions';
import { fetchUserTeam } from '../../../actions/team_actions';
import { fetchGame, createNewGame, exitGame, updateCurrentGame } from '../../../actions/game_actions'

const mapStateToProps = state => {
	return {
		loggedIn: state.session.isAuthenticated,
		currentUser: state.session,
		currentUserID: state.session.user.id
	};
};

const mapDispatchToProps = dispatch => ({
  fetchMonsters: () => dispatch(fetchMonsters()),
  fetchTeam: (userId) => dispatch(fetchUserTeam(userId)),
  createGame: (game) => dispatch(createNewGame(game)),
  updateGame: (gameId, data) => dispatch(updateCurrentGame(gameId, data)),
  exitGame: (gameId) => dispatch(exitGame(gameId)),
  fetchGame: (gameId) => dispatch(fetchGame(gameId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
