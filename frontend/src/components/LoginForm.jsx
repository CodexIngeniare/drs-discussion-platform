import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEmailValid, isLoginPasswordValid } from '../utils/UserDataValidations.js';
import { login, GetUserData } from '../utils/api_calls/AccountAPICalls.js';
import '../styles/login/LoginForm.css';

function LoginForm(props) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    const handleLogin = async () => {
        const loginResult = await login(email, password, props.LoginEndpoint);

        if (loginResult.success) {
            const token = loginResult.data.token;
            sessionStorage.setItem("token", token);
            console.log(token);
            return true
        } else {
            const error_code = loginResult.error.error_code;
            switch(error_code) {
                case "EMAIL_NOT_REGISTERED":
                    setErrors({"email": "email is not registered."});
                    break;
                case "INVALID_PASSWORD":
                    setErrors({"password": "incorrect password."});
                    break;
                default:
                    break;
            }
            return false;
        }
    }
    const handleGetUserData = async () => {
        const token = sessionStorage.getItem("token");
        const result = await GetUserData(token, props.UserDataEndpoint);

        if (result.success) {
            const userData = result.data;
            sessionStorage.setItem("user", JSON.stringify(userData));
            console.log(userData);
            return true;
        } else {
            const error_code = result.error.error_code;
            switch(error_code) {
                case "INVALID_TOKEN":
                    console.log("invalid token");
                    break;
                default:
                    break;
            }
            return false;
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting){
            return;
        }
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }
        if(!handleLogin()){
            setIsSubmitting(false);
            return;
        }
        if(!handleGetUserData()){
            setIsSubmitting(false);
            return;
        }
        setIsSubmitting(false);
        navigate('/dashboard');
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
                </div>   
                <div>
                    <button className='success-btn' type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;