import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div >
      {isLoaded && (
        <div id='nav-container'>
          {sessionUser && (
            <NavLink to="/spots/new" >
              <button className='create-spot-button' >
                Create Spot
              </button>
            </NavLink>
          )}
          <div id='right-side-feat'>
            <NavLink exact to="/spots" id='home'>
              <i className="fa-sharp fa-solid fa-house"></i>
            </NavLink>
            <ProfileButton user={sessionUser} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
