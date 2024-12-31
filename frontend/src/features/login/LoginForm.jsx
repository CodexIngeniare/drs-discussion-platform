import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context';
import { useAuthenticateUser, useFetchAccountData } from './hooks';
import { useInputField } from '../../hooks';
import { TextInput, PasswordInput } from '../../components';
import { validateEmail, validateLoginPassword } from '../../utils';
import './LoginForm.css';

function LoginForm(props) {
    const { loadContextFromSession } = useContext(AuthContext);
    const navigate = useNavigate();

    const emailField = useInputField('', false, validateEmail, true);
    const passwordField = useInputField('', false, validateLoginPassword, true);

    const { isAuthenticating, authErrors, handleAuthentication } = useAuthenticateUser(props.LoginEndpoint);
    const { isFetching, fetchErrors, fetchAccountData } = useFetchAccountData(props.UserDataEndpoint);

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

    return (
        <form className='LoginForm' onSubmit={handleSubmit}>
            <TextInput
                label="Email"
                value={emailField.value}
                handleChange={emailField.handleChange}
                error={emailField.error}
                placeholder="enter your email address"
            />
            <PasswordInput
                label="Password"
                value={passwordField.value}
                handleChange={passwordField.handleChange}
                error={passwordField.error}
                placeholder="enter your password"
            />  
            <button className='success-btn' type='submit' disabled={isAuthenticating || isFetching}>
                {isAuthenticating || isFetching ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
}

export default LoginForm;