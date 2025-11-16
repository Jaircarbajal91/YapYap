import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import { login } from '../store/session';

const LoginForm = ({ sessionUser }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="relative flex min-h-screen w-full items-center justify-center bg-login-bg bg-cover bg-center px-4 py-16 sm:px-8">
      <div className="absolute inset-0 bg-[rgba(19,22,32,0.75)] backdrop-blur-sm" />
      <form
        className="glass-card relative z-10 flex w-full max-w-xl flex-col gap-6 rounded-3xl p-10 text-offWhite"
        onSubmit={onLogin}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            welcome back
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">Log into YapYap</h1>
          <p className="text-sm text-white/70">
            We're so excited to see you again—pick up right where you left off.
          </p>
        </div>
        <div className="space-y-4 text-sm text-lightGray">
          <div className="space-y-2">
            <label
              className={`block text-xs font-semibold uppercase tracking-[0.2em] ${errors.length > 0 ? "text-lightRed" : "text-white/70"}`}
              htmlFor="login-email"
            >
              Email or username
              <span className="ml-2 text-lightRed">
                {errors.length > 0 ? "Login or password is invalid" : "*"}
              </span>
            </label>
            <input
              className="w-full rounded-2xl border border-borderMuted/60 bg-surfaceLight/80 px-4 py-3 text-base text-offWhite shadow-inner-card outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-primary"
              type="text"
              name="email"
              id="login-email"
              value={credential}
              onChange={updateCredential}
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <label
              className={`block text-xs font-semibold uppercase tracking-[0.2em] ${errors.length > 0 ? "text-lightRed" : "text-white/70"}`}
              htmlFor="login-password"
            >
              Password
              <span className="ml-2 text-lightRed">
                {errors.length > 0 ? "Login or password is invalid" : "*"}
              </span>
            </label>
            <input
              className="w-full rounded-2xl border border-borderMuted/60 bg-surfaceLight/80 px-4 py-3 text-base text-offWhite shadow-inner-card outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-primary"
              type="password"
              name="password"
              id="login-password"
              value={password}
              onChange={updatePassword}
              autoComplete="current-password"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            className="rounded-2xl border border-white/15 bg-white/12 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            onClick={demoLogin}
            type="button"
          >
            Demo login
          </button>
          <button
            className="rounded-2xl bg-hero px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-heroDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            type="submit"
          >
            Log in
          </button>
        </div>
        <p className="text-center text-sm text-white/70">
          Need an account?{" "}
          <span
            onClick={() => {
              history.push('/register')
            }}
            className="cursor-pointer font-semibold text-torqoise transition-colors duration-200 hover:text-white"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
