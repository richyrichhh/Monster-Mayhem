import { connect } from 'react-redux';
import { closeModal } from '../../../actions/modal_actions';
import FightMessage from './fight_message';

const mapDTP = dispatch => ({
  closeModal: () => dispatch(closeModal())
});

export default connect(null, mapDTP)(FightMessage);