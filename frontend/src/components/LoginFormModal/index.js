import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session'

import './loginForm.css';

export default function LoginFormModal() {
  const dispatch = useDispatch()
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])
  const { closeModal } = useModal();

  const demoUser = {
    credential: "Demo-lition",
    password: "password"
  }

  const demoLogin = (e) => {
    return dispatch(sessionActions.login(demoUser))
      .then(closeModal)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([])
    // set the user to be passed through to login
    const user = {
      credential,
      password
    }
    return dispatch(sessionActions.login(user))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors)
      });
  }

  return (
    <div className="log-in-div">
      <h1>Log In</h1>
      <form className="log-in-form" onSubmit={handleSubmit}>
          {errors.map((error, idx) => (
            <p key={idx} id='error-log-in-form'>{error}</p>
          ))}
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder='Username or Email'
            className='email-password-input'
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
            className='email-password-input'
          />
        <button
          type="submit"
          id='login-submit'
        >
          Log In
        </button>
      </form>
      <button
        id='demo-button'
        onClick={demoLogin}
      >Demo User</button>
    </div>
  );
};
