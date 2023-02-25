import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as sessionActions from '../../store/session'
import './loginForm.css';

export default function LoginFormPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])

    if (sessionUser) {
        return <Redirect to="/" />
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([])
        // set the user to be passed through to login
        const user = {
            credential,
            password
        }
        return dispatch(sessionActions.login(user))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors)
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {errors.map((error, idx) =>
                    <li key={idx}>{error}</li>)}
            </ul>
            <label>
                Username or Email
                <input
                    type='text'
                    value={credential}
                    onChange={e => setCredential(e.target.value)}
                    placeholder='Username or Email'
                    name='credential'
                />
            </label>
            <label>
                Password
                <input
                    type='text'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Password'
                    name='password'
                />
            </label>
            <button type='submit'>Log In</button>
        </form>
    );
};
