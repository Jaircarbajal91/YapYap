import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux'
import LoginForm from './auth/LoginForm'
import Logout from './auth/Logout';
import './App.css'

function App() {
  const sessionUser = useSelector(session => session.user)
  return (
    <div className="App">
        <Switch>
          <Route path='/' exact={true}>
            <LoginForm sessionUser={sessionUser} />
            <Logout />
          </Route>
        </Switch>
    </div>
  )
}

export default App
