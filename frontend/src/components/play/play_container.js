import { connect } from 'react-redux';
import { fetchGame, createNewGame, updateCurrentGame, exitGame} from '../../actions/game_actions';

import Play from './play';

const mapStateToProps = state => ({
    loggedIn: state.session.isAuthenticated,
    game: state.game,
});

const mapDispatchToProps = dispatch => ({
    fetchGame: id => dispatch(fetchGame(id)),
    createNewGame: game => dispatch(createNewGame(game)),
    exitGame: () => dispatch(exitGame()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Play);