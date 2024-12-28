import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthenticateUser from './hooks/useAuthenticateUser.js';
import useFetchAccountData from './hooks/useFetchAccountData.js';
import { isEmailValid, isLoginPasswordValid } from '../../utils/UserDataValidations.js';
import './LoginForm.css';

function LoginForm(props) {
    const navigate = useNavigate();
    const { isAuthenticating, authErrors, handleAuthentication } = useAuthenticateUser(props.LoginEndpoint);
    const { isFetching, fetchErrors, fetchAccountData } = useFetchAccountData(props.UserDataEndpoint);

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validateForm = () => {
        const newErrors = {};

        isEmailValid(email, newErrors);
        isLoginPasswordValid(password, newErrors);

        setErrors(newErrors);

        if(Object.keys(newErrors).length === 0)
            return true;

        return false;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isAuthenticating || isFetching) {
            return;
        }
        if (!validateForm()) {
            return;
        }
        if (await handleAuthentication(email, password)) {
            const token = sessionStorage.getItem("token");
            
            if (await fetchAccountData(token)) {
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='enter your email address'
                    />
                    {errors.email && <div className='error-message'><span>{errors.email}</span></div>}
                    {authErrors.email && <div className='error-message'><span>{authErrors.email}</span></div>}
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <br />
                    <div className='login-password'>
                        <input id='password'
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='enter your password'
                        />
                        <button className='login-toggle-password' type="button" onClick={togglePasswordVisibility}>
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {errors.password && <div className='error-message'><span>{errors.password}</span></div>}
                    {authErrors.password && <div className='error-message'><span>{authErrors.password}</span></div>}
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