import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux'
import LoginForm from './auth/LoginForm'
import Logout from './auth/Logout';
import Splash from './components/splash';
import './App.css'

function App() {
  const sessionUser = useSelector(session => session.user)
  return (
    <div className="App">
        <Switch>
          <Route path='/login' exact={true}>
            <LoginForm />
            <Logout />
          </Route>
          <Route path="/app">
            Logged In App with Servers
          </Route>
          <Route path="/" exact={true}>
            <Splash />
          </Route>
          <Route path="*">
            Page Not Found
          </Route>
        </Switch>
    </div>
  )
}

export default App
