import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from './components/SignupFormPage';
import * as sessionActions from './store/session'

function App() {

  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restore()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <Switch >
      <Route path='/login' >
        <LoginFormPage />
      </Route>
      <Route path='/signup' >
        <SignupFormPage />
      </Route>
    </Switch>
  );
}

export default App;
