import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import './App.css'

function App() {
  const sessionUser = useSelector(session => session.user)
  return (
    <div className="App">
        <h1>Hi!!!!</h1>
    </div>
  )
}

export default App
