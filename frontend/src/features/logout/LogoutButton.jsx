import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLogoutUser } from './hooks';
import './LogoutButton.css';

function LogoutButton() {
    const navigate = useNavigate();
    const { isLoggingOut, handleLogout } = useLogoutUser("http://127.0.0.1:5000/logout");

    const {
        token,
        setToken,
        setUserRole,
        setUsername,
        setEmail,
        setFirstName,
        setLastName,
        setPhoneNumber,
        setCountry,
        setCity,
        setAddress
    } = useContext(AuthContext);

    const clearSessionStorage = () => {
        sessionStorage.clear();

        setToken(null);
        setUserRole("user");
        setUsername("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setCountry("");
        setCity("");
        setAddress("");
    };

    const handleLogoutClick = async () => {
        if(!(await handleLogout(token))){
            return;
        }
        clearSessionStorage();
        navigate('/login');
    };

    return (
        <button className="LogoutButton" onClick={handleLogoutClick}>
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
        </button>
    );
}

export default LogoutButton;