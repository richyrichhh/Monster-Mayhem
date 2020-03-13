import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div id="main-menu-div">
      <ul id="main-menu-options">
        <li><Link className='main-menu-link' to="/game/search">Fight</Link></li>
        {/* <li><Link className='main-menu-link' to="/game/team">Edit Team</Link></li> */}
      </ul>
    </div>
  )
}