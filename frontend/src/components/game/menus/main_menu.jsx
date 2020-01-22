import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div id="main-menu-div">
      <ul id="main-menu-options">
        <li><Link to="/game/play">Fight</Link></li>
        <li><Link to="/game/menu/team">Edit Team</Link></li>
      </ul>
    </div>
  )
}