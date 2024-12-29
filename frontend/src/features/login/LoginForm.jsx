import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.js';
import useAuthenticateUser from './hooks/useAuthenticateUser.js';
import useFetchAccountData from './hooks/useFetchAccountData.js';
import useInputField from '../../hooks/useInputField.js';
import { validateEmail, validateLoginPassword } from '../../utils/UserDataValidations.js';
import './LoginForm.css';

function LoginForm(props) {
    const { loadContextFromSession } = useContext(AuthContext);
    const navigate = useNavigate();

    const emailField = useInputField('', false, validateEmail);
    const passwordField = useInputField('', false, validateLoginPassword);

    const { isAuthenticating, authErrors, handleAuthentication } = useAuthenticateUser(props.LoginEndpoint);
    const { isFetching, fetchErrors, fetchAccountData } = useFetchAccountData(props.UserDataEndpoint);

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        emailField.setError(authErrors.email);
        passwordField.setError(authErrors.password);
    }, [authErrors]);

    const validateForm = () => {
        let valid = true;

        emailField.validate();
        passwordField.validate();

        if (!emailField.isValid) {
            valid = false;
        }
        if (!passwordField.isValid) {
            valid = false;
        }
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isAuthenticating || isFetching) {
            return;
        }
        if (!validateForm()) {
            return;
        }
        if (await handleAuthentication(emailField.value, passwordField.value)) {
            const token = sessionStorage.getItem("token");

            if (await fetchAccountData(token)) {
                loadContextFromSession();
                navigate('/dashboard');
            }
            else {
                console.error("Error fetching user data: ", fetchErrors.token);
            }
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="LoginForm">
            <form className='login-form-container' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <br />
                    <input id='email'
                        type='text'
                        value={emailField.value}
                        onChange={(e) => emailField.handleChange(e.target.value)}
                        placeholder='enter your email address'
                    />
                    {emailField.error && <div className='error-message'><span>{emailField.error}</span></div>}
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <br />
                    <div className='login-password'>
                        <input id='password'
                            type={showPassword ? 'text' : 'password'}
                            value={passwordField.value}
                            onChange={(e) => passwordField.handleChange(e.target.value)}
                            placeholder='enter your password'
                        />
                        <button className='login-toggle-password' type="button" onClick={togglePasswordVisibility}>
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {passwordField.error && <div className='error-message'><span>{passwordField.error}</span></div>}
                </div>   
                <div>
                    <button className='success-btn' type='submit' disabled={isAuthenticating || isFetching}>
                        {isAuthenticating || isFetching ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;