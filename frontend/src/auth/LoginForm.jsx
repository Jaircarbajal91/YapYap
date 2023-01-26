import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { csrfFetch } from '../store/csrf';
import { useHistory, Redirect } from 'react-router-dom';
import { login } from '../store/session';


const LoginForm = ({ sessionUser }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  // const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login({ credential, password }));
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
    dispatch(login({ credential: 'Demo_User', password: 'password' }));
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
    <div className="flex justify-center items-center w-screen h-screen bg-[url('../../assets/svg/login.svg')] bg-center bg-no-repeat bg-cover ">
      <form className='flex flex-col justify-between bg-gray h-2/5 rounded-lg w-3/12 p-8' onSubmit={onLogin}>
        <div className='flex flex-col text-white w-full items-center mb-4'>
          <h1 className='text-2xl tracking-wide mb-2'>Welcome back!</h1>
          <p className='text-lightGray tracking-wide text-sm'>We're so excited to see you again!</p>
        </div>
        <div className='text-lightGray mb-3'>
          <label className='block uppercase text-xs mb-2 font-bold' for="login-email">Email or username <span className='text-lightRed'>*</span></label>
          <input
            className='bg-darkGray w-full h-10 rounded-md px-2 focus:outline-none mb-4'
            type="text"
            name="email"
            id="login-email"
            value={credential}
            onChange={updateCredential}
          />
          <label className='block uppercase text-xs mb-2 font-bold' for="login-password">Password <span className='text-lightRed'>*</span></label>
          <input
            className='bg-darkGray w-full h-10 rounded-md px-2 focus:outline-none'
            type="password"
            name="password"
            id="login-password"
            value={password}
            onChange={updatePassword}
          />
        </div>
        <div className='flex justify-between w-full gap-3'>
          <button className='bg-navy text-white rounded-md p-2 w-1/2' type="submit">Log In</button>
          <button className='bg-yellow text-black rounded-md p-2 w-1/2' onClick={demoLogin}>Demo</button>
        </div>
        <p className='text-lightGray tracking-wide text-sm'>Need an account? <span className='text-torqoise'>Register</span></p>
      </form>
    </div>
  )
}

export default LoginForm;
