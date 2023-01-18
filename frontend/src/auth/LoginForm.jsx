import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { csrfFetch } from '../store/csrf';
import { Redirect } from 'react-router-dom';
import { login } from '../store/session';
import './LoginForm.css';


const LoginForm = ({ sessionUser }) => {
  const dispatch = useDispatch();
  const session = useSelector(state => state.session);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);


  // useEffect(() => {
  //   const user = csrfFetch('http://127.0.0.1:8000/api/users/current')
  //     .then(data => data.json())
  //     .then(data => console.log(data))
  // }, [])

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login({credential, password}));
    if (data) {
      setErrors(data);
    } else {
      return (
        <Redirect to="/" />
      )
    }
  };

  const updateCredential = (e) => {
    setCredential(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (sessionUser) return (
    <Redirect to="/" />
  );


  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={onLogin}>
        <div className="login-form__header">
          <h1 className="login-form__header__title">Log In</h1>
        </div>
        <div className="login-form__body">
          <div className="login-form__body__input">
            <label className="login-form__body__input__label">Email/Username: </label>
            <input
              className="login-form__body__input__input"
              type="text"
              name="email"
              placeholder="Email/Username"
              value={credential}
              onChange={updateCredential}
            />
          </div>
          <div className="login-form__body__input">
            <label className="login-form__body__input__label">Password: </label>
            <input
              className="login-form__body__input__input"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={updatePassword}
            />
          </div>
        </div>
        <div className="login-form__footer">
          <button className="login-form__footer__button" type="submit">Log In</button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm;
