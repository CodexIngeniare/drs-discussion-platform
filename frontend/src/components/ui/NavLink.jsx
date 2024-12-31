import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavLink.css';

function NavLink({ label, link }) {
    const navigate = useNavigate();

    const navigateTo = () => {
        navigate(link);
    };

    return (
        <label className='NavLink' onClick={navigateTo}>
            {label}
        </label>
    );
}

export default NavLink;