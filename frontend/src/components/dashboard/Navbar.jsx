import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard/Navbar.css';

function Navbar() {
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem("user"));
        if (userData) {
            setUsername(userData.username);
            setIsAdmin(userData.is_admin);
        }
    }, []);
    const toAdminView = () => {
        navigate('/dashboard/admin');
    }
    const toDiscussionsView = () => {
        navigate('/dashboard/discussions');
    }
    const toSettingsView = () => {
        navigate('/dashboard/settings');
    }

    return (
        <div className="Navbar">
            <div className="view-btns">
                { isAdmin &&
                    <>
                        <button onClick={toAdminView}>Administration</button>
                        <label>|</label>
                    </>
                } 
                <button onClick={toDiscussionsView}>Discussions</button>
            </div>
            <div className='account-btns'>
                <button onClick={toSettingsView}>@{username}</button>
            </div>
        </div>
    );
}

export default Navbar;