import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login/LoginForm.css';

function LoginForm(props) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateEmail = (newErrors) => {
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email.";
        }
    };
    const validatePassword = (newErrors) => {
        if (!password) {
            newErrors.password = "Password is required.";
        }
    };
    const validateForm = () => {
        const newErrors = {};

        validateEmail(newErrors);
        validatePassword(newErrors);

        setErrors(newErrors);

        if(Object.keys(newErrors).length === 0)
            return true;

        return false;
    };
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
        try {
            const response = await fetch(props.apiLoginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                    const responseData = await response.json();
                    const token = responseData.token;
                    sessionStorage.setItem("token", token);
                    navigate("/dashboard");
            } else {
                const errorData = await response.json();
                if(errorData.error_code === "EMAIL_NOT_REGISTERED")
                {
                    setErrors({"email": "email is not registered."});
                }
                if(errorData.error_code === "INVALID_PASSWORD")
                    {
                        setErrors({"password": "incorrect password."});
                    }
                console.log(errorData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const navigateToRegistration = () => {
        navigate("/register");
    };

    return (
        <div className="LoginForm">
            <form className='form-container' onSubmit={handleSubmit}>
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
                    <input id='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='enter your password'
                    />
                    {errors.password && <div className='error-message'><span>{errors.password}</span></div>}
                </div>   
                <div className='button-container'>
                    <button type='button' onClick={navigateToRegistration}>Sign up</button>
                    <button className='success-btn' type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;