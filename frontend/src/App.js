import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import Navigation from './components/Navigation';
import * as sessionActions from './store/session'
import SpotsDisplay from './components/SpotsDisplay';
import SpotDetails from './components/SpotsDisplay/SpotDetails';
import CreateSpot from './components/SpotsDisplay/CreateSpot';
import ManageSpots from './components/SpotsDisplay/ManageSpots';
import UpdateSpotDetails from './components/SpotsDisplay/UpdateSpotDetails';

function App() {

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restore()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch >
          <Route exact path='/spots' >
            <SpotsDisplay />
          </Route>
          <Route exact path='/spots/new'>
            <CreateSpot />
          </Route>
          <Route path='/spots/current' >
            <ManageSpots />
          </Route>
          <Route path='/spots/update/:spotId' >
            <UpdateSpotDetails />
          </Route>
          <Route path='/spots/:spotId' >
            <SpotDetails />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
