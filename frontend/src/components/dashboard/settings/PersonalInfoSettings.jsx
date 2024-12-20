import React, { useState, useEffect } from 'react';
import '../../../styles/dashboard/PersonalInfoSettings.css'

function PersonalInfoSettings() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    
    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem("user"));
        if (userData) {
            setFirstName(userData.first_name);
            setLastName(userData.last_name);
            setPhoneNumber(userData.phone_number);
            setCountry(userData.country);
            setCity(userData.city);
            setAddress(userData.address);
        }
    }, []);

    return (
      <div className='PersonalInfoSettings'>
          <div className='settings-title'>
              <label>Personal Info</label>
              <hr />
          </div>
          <div className='input-field'>
              <label>First Name</label>
              <input type='text' value={first_name}></input>
          </div>
          <div className='input-field'>
              <label>Last Name</label>
              <input type='text' value={last_name}></input>
          </div>
          <div className='input-field'>
              <label>Phone Number</label>
              <input type='text' value={phone_number}></input>
          </div>
          <div>
              <hr />
          </div>
          <div className='input-field'>
              <label>Country</label>
              <input type='text' value={country}></input>
          </div>
          <div className='input-field'>
              <label>City</label>
              <input type='text' value={city}></input>
          </div>
          <div className='input-field'>
              <label>Address</label>
              <input type='text' value={address}></input>
          </div>
      </div>
    );
}

export default PersonalInfoSettings;