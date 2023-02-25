import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import { login } from '../store/session';
import SignupForm from './SignupForm';



const LoginForm = ({ sessionUser }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  // const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setErrors([])
  }, [credential.length, password.length])

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await dispatch(login({ credential, password }));
      return (<Redirect to="/app" />)
    } catch(err) {
      err = await err.json()
      setErrors([err.errors[0]])
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
    <div className={`flex justify-center items-center w-screen h-screen bg-login-bg bg-center bg-no-repeat bg-cover`}>
      <form className='flex flex-col w-full h-full min-h-[30em] lg:max-w-[40em] justify-between bg-chatBg md:h-2/5 md:rounded-lg md:w-1/4 md:min-w-[30em] p-8 md:transition duration-150 ease-out' onSubmit={onLogin}>
        <div className='flex flex-col text-white w-full items-center mb-4'>
          <h1 className='text-2xl tracking-wide mb-2'>Welcome back!</h1>
          <p className='text-lightGray tracking-wide text-sm'>We're so excited to see you again!</p>
        </div>
        <div className='text-lightGray mb-3'>
          <label className={`block uppercase text-xs mb-2 font-bold ${errors.length > 0 ? "text-lightRed" : ""}`} htmlFor="login-email">Email or username <span className='text-lightRed'>{errors.length > 0 ? "- Login or password is invalid" : "*"}</span></label>
          <input
            className='bg-darkGray w-full h-10 rounded-md px-2 focus:outline-none mb-4'
            type="text"
            name="email"
            id="login-email"
            value={credential}
            onChange={updateCredential}
          />
          <label className={`block uppercase text-xs mb-2 font-bold ${errors.length > 0 ? "text-lightRed" : ""}`} htmlFor="login-password">Password <span className='text-lightRed'>{errors.length > 0 ? "- Login or password is invalid" : "*"}</span></label>
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
          <button className='bg-yellow text-black rounded-md p-2 w-1/2' onClick={demoLogin}>Demo</button>
          <button className='bg-navy text-white rounded-md p-2 w-1/2' type="submit">Log In</button>
        </div>
        <p className='text-lightGray tracking-wide text-sm'>Need an account? <span onClick={() => {
          history.push('/register')
          }} className='text-torqoise cursor-pointer hover:underline'>Register</span></p>
      </form>
    </div>
  );
}

export default LoginForm;
