import React from 'react';
import { Link } from 'react-router-dom';
import './NavLink.css';

function NavLink({ label, link }) {
    return (
        <Link to={link} className="NavLink">
            {label}
        </Link>
    );
}

export default NavLink;