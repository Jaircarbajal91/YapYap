import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  // useEffect(() => {
  //   const errors = [];
  //   if (email.length === 0) {
  //     errors.push('Email cannot be empty');
  //   }
  //   if (username.length === 0) {
  //     errors.push('Username cannot be empty');
  //   }
  //   if (password.length === 0) {
  //     errors.push('Password cannot be empty');
  //   }
  //   setErrors(errors);
  // }, [errors, email, username, password]);

  const history = useHistory();
  const handleSignUp = (e) => {
    e.preventDefault();
    console.log('hello')
  }
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[url('../../assets/svg/login.svg')] bg-center bg-no-repeat bg-cover ">
      <form className='flex flex-col w-full h-full min-h-[30em] lg:max-w-[40em] justify-between bg-gray md:h-2/5 rounded-lg md:w-1/4 md:min-w-[30em] p-8 md:transition-opacity-70' onSubmit={handleSignUp}>
        <div className="flex flex-col text-white w-full items-center mb-4">
          <h1 className="text-2xl tracking-wide mb-2">Create an account</h1>
        </div>
        <div className='text-lightGray mb-3'>
          <label className='block uppercase text-xs mb-2 font-bold' htmlFor="signup-email">Email</label>
          <input
            className='bg-darkGray w-full h-10 rounded-md px-2 focus:outline-none mb-4'
            type="text"
            name="email"
            id="signup-email"
            value={email}
            onChange={setEmail}
          />
          <label className='block uppercase text-xs mb-2 font-bold' htmlFor="signup-username">Username</label>
          <input
            className='bg-darkGray w-full h-10 rounded-md px-2 focus:outline-none mb-4'
            type="text"
            name="username"
            id="signup-username"
            value={username}
            onChange={setUsername}
          />
          <label className='block uppercase text-xs mb-2 font-bold' htmlFor="signup-password">Password</label>
          <input
            className='bg-darkGray w-full h-10 rounded-md px-2 focus:outline-none mb-4'
            type="password"
            name="password"
            id="signup-password"
            value={password}
            onChange={setPassword}
          />
        </div>
        <button className='bg-navy text-white w-full h-10 rounded-md focus:outline-none' type="submit">Sign up</button>
        <p onClick={() => {
          history.push('/login')
        }}
          className='tracking-wide text-sm text-torqoise cursor-pointer hover:underline'>Already have an account?</p>
      </form>
    </div>
  )

}

export default SignupForm;
