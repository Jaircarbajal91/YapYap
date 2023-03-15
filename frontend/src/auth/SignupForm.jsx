import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSingleImage } from '../store/aws_images';
import { signupUser } from '../store/session';

const SignupForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [emailErrors, setEmailErrors] = useState([])
  const [username, setUsername] = useState('');
  const [usernameErrors, setUsernameErrors] = useState([])
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([])
  const [image, setImage] = useState(null);
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
  const handleSignUp = async (e) => {
    e.preventDefault();
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
        if (error.includes('email')) setEmailErrors([...emailErrors, error])
        if (error.includes('username')) setUsernameErrors([...usernameErrors, error])
        if (error.includes('password')) setPasswordErrors([...passwordErrors, error])
        else setErrors([...errors, error])
      })
    }
  }


  const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-login-bg bg-center bg-no-repeat bg-cover ">
      <form className='flex flex-col w-full h-full min-h-[30em] lg:max-w-[40em] justify-between bg-chatBg md:h-3/5 md:rounded-lg md:w-1/4 md:min-w-[30em] p-8 md:max-h-[40em]' onSubmit={handleSignUp}>
        <div className="flex flex-col text-white w-full items-center mb-4">
          <h1 className="text-2xl tracking-wide mb-2">Create an account</h1>
        </div>
        {errors.length > 0 && <div>
          {errors.map((error, idx) => <div className='uppercase text-lightRed -mt-6 w-full text-center' key={idx}>{error}</div>)}
          </div>}
        <div className='text-lightGray mb-3'>
          <label className={`block uppercase text-xs mb-2 font-bold ${emailErrors.length > 0 ?"text-lightRed" : ""}`} htmlFor="signup-email">{emailErrors.length > 0 ? `Email - ${emailErrors[0]}` : "Email"}</label>
          <input
            className='bg-darkGray w-full h-10 rounded-md px-2 focus:outline-none mb-4'
            type="text"
            name="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className={`block uppercase text-xs mb-2 font-bold ${usernameErrors.length > 0 ?"text-lightRed" : ""}`} htmlFor="signup-username">{usernameErrors.length > 0 ? `Username - ${usernameErrors[0]}` : "Username"}</label>
          <input
            className='bg-darkGray w-full h-10 rounded-md px-2 focus:outline-none mb-4'
            type="text"
            name="username"
            id="signup-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className={`block uppercase text-xs mb-2 font-bold ${passwordErrors.length > 0 ?"text-lightRed" : ""}`} htmlFor="signup-password">{passwordErrors.length > 0 ? `Password - ${passwordErrors[0]}` : "Password"}</label>
          <input
            className='bg-darkGray w-full h-10 rounded-md px-2 focus:outline-none mb-4'
            type="password"
            name="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className='block uppercase text-xs mb-2 font-bold text-lightGray' htmlFor="signup-image">Profile Image</label>
          <input
            className='mb-4 text-lightGray'
            type="file"
            name="image"
            accept='.png, .jpg, .jpeg'
            id="signup-image"
            onChange={updateFile}
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
