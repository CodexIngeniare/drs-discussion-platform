import React, { useState, useEffect } from 'react';
import '../../../styles/dashboard/AccountSettings.css';

function AccountSettings() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem("user"));
        if (userData) {
            setEmail(userData.email);
            setUsername(userData.username);
        }
    }, []);

    return (
      <div className='AccountSettings'>
          <div className='settings-title'>
              <label>Account Settings</label>
              <hr />
          </div>
          <div className='input-field'>
              <label>Email</label>
              <input type='text' value={email}></input>
          </div>
          <div className='input-field'>
              <label>Username</label>
              <input type='text' value={username}></input>
          </div>
          <div>
              <hr />
          </div>
          <div className='input-field'>
              <label>Password</label>
              <input type='password' placeholder='enter your current password'></input>
          </div>
          <div className='input-field'>
              <label>New Password</label>
              <input type='password' placeholder='enter your new password'></input>
          </div>
      </div>
    );
}

export default AccountSettings;
