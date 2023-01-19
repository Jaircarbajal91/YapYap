import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import {restoreUser} from './store/session';
import LoginForm from './auth/LoginForm'
import Logout from './auth/Logout';
import Splash from './components/splash';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const sessionUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <div className="App">
      {/* <h1 className="text-8xl font-bold underline">
        Hello world!
      </h1> */}
        <Switch>
          <Route path='/login' exact={true}>
            <LoginForm sessionUser={sessionUser} />
          </Route>
          <ProtectedRoute path="/app">
            Logged In App with Servers
            <Logout />
          </ProtectedRoute>
          <Route path="/" exact={true}>
            <Splash sessionUser={sessionUser} />
          </Route>
          <Route path="*">
            Page Not Found
          </Route>
        </Switch>
    </div>
  )
}

export default App
