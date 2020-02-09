import React from 'react';
import { Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';

import MainPage from './main/main_page';
import Modal from './modal/modal';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import GameContainer from './game/game_container';
import PlayContainer from './play/play_container';

const App = () => (
  <div>
    <NavBarContainer />
    <div id="page-main-div">
      <Switch>
        <Route exact path="/" component={MainPage} />
        <AuthRoute exact path="/login" component={LoginFormContainer} />
        <AuthRoute exact path="/signup" component={SignupFormContainer} />
        <ProtectedRoute exact path="/game" component={GameContainer} />
        <ProtectedRoute exact path="/game/play" component={PlayContainer} />
      </Switch>
    </div>
  </div>
);

export default App;