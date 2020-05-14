import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
// import { Switch, Redirect} from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';

import Modal from './modal/modal';
import MainPage from './main/main_page';
import AboutContainer from './about/about';
// import LoginFormContainer from './session/login_form_container';
// import SignupFormContainer from './session/signup_form_container';
import GameContainer from './game/game_container';
import SearchContainer from './game/search/search_container';
// import PlayContainer from './play/play_container';
import RealPlayContainer from './game/play/play_container';
import LearnContainer from './learn/learn';
import FooterContainer from './footer/footer';

const App = () => (
  <div>
    <Modal />
    <NavBarContainer />
    <div id="page-main-div">
      {/* <React.StrictMode> */}
      <Switch>
        <AuthRoute exact path="/" component={MainPage} />
        <Route exact path="/about" component={AboutContainer} />
        <ProtectedRoute exact path="/learn" component={LearnContainer} />
        <ProtectedRoute exact path="/game" component={GameContainer} />
        <ProtectedRoute exact path="/game/search" component={SearchContainer} />
        <ProtectedRoute exact path="/game/play/:gameId" component={RealPlayContainer} />
        <Redirect to="/game" />
      </Switch>
      {/* </React.StrictMode> */}
    </div>
       <FooterContainer />
  </div>
);

export default App;