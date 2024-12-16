import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import * as validationUtils from '../utils/UserDataValidations.js';
import '../styles/register/RegisterForm.css';

function RegisterForm(props) {
    //const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // user form data
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");

    const validateForm = () => {
        const newErrors = {};

        validationUtils.isEmailValid(email, newErrors);
        validationUtils.isUsernameValid(username, newErrors);
        validationUtils.isRegisterPasswordValid(password, newErrors);
        validationUtils.isFirstNameValid(first_name, newErrors);
        validationUtils.isLastNameValid(last_name, newErrors);
        validationUtils.isPhoneNumberValid(phone_number, newErrors);
        validationUtils.isCountryValid(country, newErrors);
        validationUtils.isCityValid(city, newErrors);
        validationUtils.isAddressValid(address, newErrors);

        setErrors(newErrors);

        if(Object.keys(newErrors).length === 0)
            return true;

        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(isSubmitting){
            return;
        }
        setIsSubmitting(true);

        if(!validateForm()){
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(props.apiRegisterEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    first_name,
                    last_name,
                    phone_number,
                    country,
                    city,
                    address
                }),
            });

            if (response.status >= 200 && response.status < 300) {
                props.setIsRegistered(true);
            } else {
                const errorData = await response.json();
                if(errorData.email_error === "EMAIL_ALREADY_REGISTERED")
                {
                    setErrors({"email": "email already registered."});
                }
                if(errorData.username_error === "USERNAME_ALREADY_REGISTERED")
                {
                    setErrors({"username": "username already registered."});
                }
                console.log(errorData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className='RegisterForm'>
            <form className='register-form-container' onSubmit={handleSubmit} autoComplete="off">
                <div>
                    <label htmlFor='email'>
                        Email
                        <label className="required-asterix">*</label>
                    </label>
                    <br />
                    <input id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="enter your email address"
                    />
                    {errors.email && <div className='error-message'><span>{errors.email}</span></div>}
                </div>
                <div>
                    <label htmlFor='username'>
                        Username
                        <label className="required-asterix">*</label>
                    </label>
                    <br />
                    <input id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="enter unique username"
                    />
                    {errors.username && <div className='error-message'><span>{errors.username}</span></div>}
                </div>
                <div>
                    <label htmlFor='password'>
                        Password
                        <label className="required-asterix">*</label>
                    </label>
                    <br />
                    <div className='register-password'>
                        <input id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="enter strong password"
                        />
                        <button className='register-toggle-password' type="button" onClick={togglePasswordVisibility}>
                            {showPassword ? 'Hide' : 'Show'}
                        </button>   
                    </div>
                    {errors.password && <div className='error-message'><span>{errors.password}</span></div>}
                </div>
                <div>
                    <label htmlFor='firstName'>
                        First name
                        <label className="required-asterix">*</label>
                    </label>
                    <br />
                    <input id="firstName"
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="enter your name"
                    />
                    {errors.first_name && <div className='error-message'><span>{errors.first_name}</span></div>}
                </div>
                <div>
                    <label htmlFor='lastName'>
                        Last name
                        <label className="required-asterix">*</label>
                    </label>
                    <br />
                    <input id="lastName"
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="enter your lastname"
                    />
                    {errors.last_name && <div className='error-message'><span>{errors.last_name}</span></div>}
                </div>
                <div>
                    <hr />
                </div>
                <div>
                    <label htmlFor='phoneNumber'>Phone number</label>
                    <br />
                    <input id="phoneNumber"
                        type="text"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="enter your phone number"
                    />
                    {errors.phone_number && <div className='error-message'><span>{errors.phone_number}</span></div>}
                </div>
                <div>
                    <label htmlFor='country'>Country</label>
                    <br />
                    <input id="country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="enter your country"
                    />
                    {errors.country && <div className='error-message'><span>{errors.country}</span></div>}
                </div>
                <div>
                    <label htmlFor='city'>City</label>
                    <br />
                    <input id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="enter your city"
                    />
                    {errors.city && <div className='error-message'><span>{errors.city}</span></div>}
                </div>
                <div>
                    <label htmlFor='address'>Address</label>
                    <br />
                    <input id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="enter your home address"
                    />
                    {errors.address && <div className='error-message'><span>{errors.address}</span></div>}
                </div> 
                <div>
                    <hr />
                </div>
                <div>
                    <button className='success-btn' type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Signing up...' : 'Sign up'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;