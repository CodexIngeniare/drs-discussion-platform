import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm(props) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // user form data
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");

    // form data validation functions
    const validateEmail = (newErrors) => {
        if (!email) {
            newErrors.email = "email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "please enter a valid email.";
        }
        // email max length?
    };
    const validateUsername = (newErrors) => {
        if (!username) {
            newErrors.username = "username is required.";
        }
        // username min/max length?
        // username allowed characters?
    };
    const validatePassword = (newErrors) => {
        if (!password) {
            newErrors.password = "password is required.";
        }
        // password min/max length?
        // password must contain specific characters?
    };
    const validateFirstName = (newErrors) => {
        const nameRegex = /^[A-Za-z]+$/;
        const maxLength = 100;

        if(!firstName){
            newErrors.firstName = "firstname is required.";
        } else if(!nameRegex.test(firstName)){
            newErrors.firstName = "name can contain only letters.";
        } else if(firstName.length >= maxLength){
            newErrors.firstName = "name length exceeded.";
        }
    };
    const validateLastName = (newErrors) => {
        const nameRegex = /^[A-Za-z]+$/;
        const maxLength = 100;

        if(!lastName){
            newErrors.lastName = "lastname is required.";
        } else if(!nameRegex.test(lastName)){
            newErrors.lastName = "lastname can contain only letters.";
        } else if(lastName.length >= maxLength){
            newErrors.lastName = "lastname length exceeded.";
        }
    };
    const validatePhoneNumber = (newErrors) => {
        const phoneRegex = /^(?:\+?(\d{1,3}))?[-.\s]?(?:\(?(\d{1,4})\)?[-.\s]?)(\d{1,4})[-.\s]?(\d{1,4})$/;
        if(phoneNumber === "")
            return;

        if(!phoneRegex.test(phoneNumber)){
            newErrors.phoneNumber = "phone number of wrong format";
        }
    };
    const validateCountry = (newErrors) => {
        if(country === "kosovo" || country === "Kosovo"){
            newErrors.country = "Kosovo is Serbia.";
        }
    };
    const validateCity = (newErrors) => {
    };
    const validateAddress = (newErrors) => {
    };
    const validateForm = () => {
        const newErrors = {};

        validateEmail(newErrors);
        validateUsername(newErrors);
        validatePassword(newErrors);
        validateFirstName(newErrors);
        validateLastName(newErrors);
        validatePhoneNumber(newErrors);
        validateCountry(newErrors);
        validateCity(newErrors);
        validateAddress(newErrors);

        setErrors(newErrors);

        if(Object.keys(newErrors).length === 0)
            return true;

        return false;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm())
            return;

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
                    firstName,
                    lastName,
                    phoneNumber,
                    country,
                    city,
                    address
                }),
            });

            if (response.status_code >= 200 && response.status_code < 300) {
                const responseData = await response.json();
                console.log(responseData);
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
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const navigateToLogin = () => {
        navigate("/login");
    };
    return (
        <div className='RegisterForm'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <label className="required-asterix">*</label>
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
                    <label htmlFor='username'>Username</label>
                    <label className="required-asterix">*</label>
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
                    <label htmlFor='password'>Password</label>
                    <label className="required-asterix">*</label>
                    <br />
                    <input id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="enter strong password"
                    />
                    <button type="button" onClick={togglePasswordVisibility}>
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                    {errors.password && <div className='error-message'><span>{errors.password}</span></div>}
                </div>
                <div>
                    <label htmlFor='firstName'>First name</label>
                    <label className="required-asterix">*</label>
                    <br />
                    <input id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="enter your firstname"
                    />
                    {errors.firstName && <div className='error-message'><span>{errors.firstName}</span></div>}
                </div>
                <div>
                    <label htmlFor='lastName'>Last name</label>
                    <label className="required-asterix">*</label>
                    <br />
                    <input id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="enter your lastname"
                    />
                    {errors.lastName && <div className='error-message'><span>{errors.lastName}</span></div>}
                </div>
                <div>
                    <label htmlFor='phoneNumber'>Phone number</label>
                    <br />
                    <input id="phoneNumber"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="enter your phone number"
                    />
                    {errors.phoneNumber && <div className='error-message'><span>{errors.phoneNumber}</span></div>}
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
                    <button type='button' onClick={navigateToLogin}>Sign in</button>
                    <button type='submit'>Sign up</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;