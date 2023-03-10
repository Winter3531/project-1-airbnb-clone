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
    <div className="log-in-form">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
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
      >Demo User Login</button>
    </div>
  );
};
