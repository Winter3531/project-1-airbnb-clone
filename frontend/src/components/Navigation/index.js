import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink exact to="/spots" id='home'>Home</NavLink>
      </li>
      {isLoaded && (
        <li>
          {sessionUser && (
          <NavLink to="/spots/new" >
            <button className='create-spot-button' >
              Create Spot
            </button>
          </NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
