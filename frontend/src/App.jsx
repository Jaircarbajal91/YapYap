import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import {restoreUser} from './store/session';
import LoginForm from './auth/LoginForm'
import Logout from './auth/Logout';
import Splash from './components/splash';
import Server from './components/Server';
import Servers from './components/Servers';
import Channels from './components/Channels';
import { getServers } from './store/servers';
import ProtectedRoute from './components/ProtectedRoute';
import SignupForm from './auth/SignupForm';
import MidSection from './components/MidSection';


function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [serverClicked, setServerClicked] = useState(false);


  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <div className="App flex relative">
        <Switch>
          <Route path='/login' exact={true}>
            <LoginForm sessionUser={sessionUser} />
          </Route>
          <Route path='/register' exact={true}>
            <SignupForm sessionUser={sessionUser} />
          </Route>
          <ProtectedRoute path="/app/:serverId/" exact={true}>
            <Server sessionUser={sessionUser} />
          </ProtectedRoute>
          <ProtectedRoute path="/app">
            <Servers sessionUser={sessionUser} />
            <MidSection serverClicked={serverClicked}/>
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
