import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { FaAirbnb, FaBars, FaUserCircle } from 'react-icons/fa';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='full-nav-div'>
      {isLoaded && (
        <div className='nav'>
          <div className='left-side-nav'>
            <NavLink exact to="/spots" id='home'><FaAirbnb id="home-symbol" />airbnb</NavLink>
          </div>
          <div className='right-side-nav'>
            {sessionUser && (
              <NavLink to="/spots/new" >Create a New Spot</NavLink>
            )}
            <ProfileButton user={sessionUser} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
