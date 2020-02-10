import { connect } from "react-redux";
import Search from "./search";
import { fetchMonsters } from '../../../actions/monster_actions';
import { fetchUserTeam } from '../../../actions/team_actions';
import { fetchGame, createNewGame, exitGame } from '../../../actions/game_actions'

const mapStateToProps = state => {
	return {
		loggedIn: state.session.isAuthenticated,
		currentUser: state.session,
		currentUserID: state.session.user.id,
		characters: Object.values(state.characters)
	};
};

const mapDispatchToProps = dispatch => ({
  fetchMonsters: () => dispatch(fetchMonsters()),
  fetchTeam: (userId) => dispatch(fetchUserTeam(userId)),
  createNewGame: (game) => dispatch(createNewGame(game)),
  exitGame: (gameId) => dispatch(exitGame(gameId)),
  fetchGame: (gameId) => dispatch(fetchGame(gameId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
