import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const {/*userRole,*/ username} = useContext(AuthContext);

    const toAdministration = () => {
        navigate("/dashboard/admin");
    };
    const toSettings = () => {
        navigate("/dashboard/settings");
    };
    const toDiscussions = () => {
        navigate("/dashboard/discussions");
    };

    return (
      <div className="Navbar">
          <div className='nav-buttons'>
              <button onClick={toAdministration}>Administration</button>
              <button onClick={toDiscussions}>Discussions</button>
          </div>
          <div>
              <button onClick={toSettings}>@{username}</button>
          </div>
      </div>
    );
}

export default Navbar;