import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import Navigation from './components/Navigation';
import * as sessionActions from './store/session'
import SpotsDisplay from './components/SpotsDisplay';

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
          <Route path='/api/spots' >
            <SpotsDisplay />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
