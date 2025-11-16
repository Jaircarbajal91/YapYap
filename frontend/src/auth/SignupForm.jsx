import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSingleImage } from '../store/aws_images';
import { signupUser } from '../store/session';
import { validateImageFile, ALLOWED_IMAGE_MIME_TYPES } from '../utils/fileValidation';

const SignupForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [emailErrors, setEmailErrors] = useState([])
  const [username, setUsername] = useState('');
  const [usernameErrors, setUsernameErrors] = useState([])
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([])
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setEmailErrors([])
  }, [email]);

  useEffect(() => {
    setUsernameErrors([])
  }, [username]);

  useEffect(() => {
    setPasswordErrors([])
  }, [password]);

  useEffect(() => {
    setErrors([])
  }, [email, username, password]);


  const history = useHistory();
  const validateInputs = () => {
    const localEmailErrors = [];
    const localUsernameErrors = [];
    const localPasswordErrors = [];
    const localErrors = [];

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      localEmailErrors.push('email must be a valid email address.');
    }
    if (username.trim().length < 4) {
      localUsernameErrors.push('username must be at least 4 characters long.');
    }
    if (password.length < 6) {
      localPasswordErrors.push('password must be at least 6 characters long.');
    }

    setEmailErrors(localEmailErrors);
    setUsernameErrors(localUsernameErrors);
    setPasswordErrors(localPasswordErrors);
    setErrors(localErrors);

    return (
      localEmailErrors.length === 0 &&
      localUsernameErrors.length === 0 &&
      localPasswordErrors.length === 0 &&
      localErrors.length === 0
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    let newImage;
    if (image) {
      newImage = await dispatch(addSingleImage({image, type: 'user'}));
    }
    try {
      const data = await dispatch(signupUser({ email, username, password, imageId: newImage ? newImage.id : null }));
      history.push('/app');
    } catch(err) {
      const newErrors = await err.json()
      newErrors.errors.forEach((error) => {
        error = error.toLowerCase()
        if (error.includes('email')) setEmailErrors(prev => [...prev, error])
        else if (error.includes('username')) setUsernameErrors(prev => [...prev, error])
        else if (error.includes('password')) setPasswordErrors(prev => [...prev, error])
        else setErrors(prev => [...prev, error])
      })
    }
  }


  const updateFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous errors
    setImageError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setImageError(validation.error);
      // Clear the file input
      e.target.value = "";
      return;
    }

    setImage(file);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-login-bg bg-cover bg-center px-4 py-16 sm:px-8">
      <div className="absolute inset-0 bg-[rgba(19,22,32,0.78)] backdrop-blur-md" />
      <form
        className="glass-card relative z-10 flex w-full max-w-2xl flex-col gap-6 rounded-3xl p-10 text-offWhite"
        onSubmit={handleSignUp}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            get started
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">Create your YapYap account</h1>
          <p className="text-sm text-white/70">
            Customize your profile and invite your friends to your brand new server in minutes.
          </p>
        </div>
        {errors.length > 0 && (
          <div className="rounded-2xl border border-lightRed/40 bg-lightRed/10 px-4 py-3 text-center text-xs uppercase tracking-[0.25em] text-lightRed">
            {errors.map((error, idx) => (
              <div key={idx}>{error}</div>
            ))}
          </div>
        )}
        <div className="grid gap-4 text-sm text-lightGray md:grid-cols-2">
          <div className="space-y-2">
            <label
              className={`block text-xs font-semibold uppercase tracking-[0.2em] ${emailErrors.length > 0 ? "text-lightRed" : "text-white/70"}`}
              htmlFor="signup-email"
            >
              {emailErrors.length > 0 ? `Email - ${emailErrors[0]}` : "Email"}
            </label>
            <input
              className="w-full rounded-2xl border border-borderMuted/60 bg-surfaceLight/80 px-4 py-3 text-base text-offWhite shadow-inner-card outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-primary"
              type="email"
              name="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label
              className={`block text-xs font-semibold uppercase tracking-[0.2em] ${usernameErrors.length > 0 ? "text-lightRed" : "text-white/70"}`}
              htmlFor="signup-username"
            >
              {usernameErrors.length > 0 ? `Username - ${usernameErrors[0]}` : "Username"}
            </label>
            <input
              className="w-full rounded-2xl border border-borderMuted/60 bg-surfaceLight/80 px-4 py-3 text-base text-offWhite shadow-inner-card outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-primary"
              type="text"
              name="username"
              id="signup-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label
              className={`block text-xs font-semibold uppercase tracking-[0.2em] ${passwordErrors.length > 0 ? "text-lightRed" : "text-white/70"}`}
              htmlFor="signup-password"
            >
              {passwordErrors.length > 0 ? `Password - ${passwordErrors[0]}` : "Password"}
            </label>
            <input
              className="w-full rounded-2xl border border-borderMuted/60 bg-surfaceLight/80 px-4 py-3 text-base text-offWhite shadow-inner-card outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-primary"
              type="password"
              name="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label
              className={`block text-xs font-semibold uppercase tracking-[0.2em] ${imageError ? "text-lightRed" : "text-white/70"}`}
              htmlFor="signup-image"
            >
              {imageError ? `Profile Image - ${imageError}` : "Profile Image"}
            </label>
            {imageError && (
              <div className="rounded-2xl border border-lightRed/40 bg-lightRed/10 px-4 py-2 text-xs text-lightRed">
                {imageError}
              </div>
            )}
            <input
              className="block w-full cursor-pointer rounded-2xl border border-borderMuted/60 bg-surfaceLight/60 px-4 py-3 text-sm text-white/70 shadow-inner-card outline-none transition-all duration-200 file:mr-4 file:rounded-xl file:border-0 file:bg-hero file:px-4 file:py-2 file:text-sm file:font-semibold file:uppercase file:text-white hover:file:bg-heroDark"
              type="file"
              name="image"
              accept={ALLOWED_IMAGE_MIME_TYPES}
              id="signup-image"
              onChange={updateFile}
            />
          </div>
        </div>
        <button
          className="rounded-2xl bg-hero px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-heroDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          type="submit"
        >
          Sign up
        </button>
        <p
          onClick={() => {
            history.push('/login')
          }}
          className="text-center text-sm text-white/70"
        >
          Already have an account?{" "}
          <span className="cursor-pointer font-semibold text-torqoise transition-colors duration-200 hover:text-white">
            Log in
          </span>
        </p>
      </form>
    </div>
  )

}

export default SignupForm;
