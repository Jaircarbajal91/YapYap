import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { csrfFetch } from '../store/csrf';
import { useHistory, Redirect } from 'react-router-dom';
import { login } from '../store/session';


const LoginForm = ({sessionUser}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  // const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login({credential, password}));
    if (data) {
      setErrors(data);
    } else {
      return (
        <Redirect to="/app" />
      )
    }
  };

  const demoLogin = async e => {
    e.preventDefault();
    dispatch(login({credential: 'Demo_User', password: 'password'}));
    return <Redirect to="/app" />
  };

  const updateCredential = (e) => {
    setCredential(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (sessionUser) {
    return <Redirect to="/app" />
  }

  return !sessionUser && (
    <div className="w-screen h-screen bg-[url('../../assets/svg/login.svg')] bg-center bg-no-repeat bg-cover">
      <form  onSubmit={onLogin}>
        <div >
          <h1 >Log In</h1>
        </div>
        <div >
          <div >
            <label >Email/Username: </label>
            <input
              type="text"
              name="email"
              placeholder="Email/Username"
              value={credential}
              onChange={updateCredential}
            />
          </div>
          <div >
            <label >Password: </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={updatePassword}
            />
          </div>
        </div>
        <div >
          <button type="submit">Log In</button>
          <button onClick={demoLogin}>Demo</button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm;
