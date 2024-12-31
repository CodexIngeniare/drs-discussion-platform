import { useState } from 'react';
import './PasswordInput.css';

function PasswordInput ({ label, value, error, placeholder, handleChange }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='PasswordInput'>
            <div className='PasswordInput__label-container'>
                <label className='PasswordInput__label'>
                    {label}
                </label>
            </div>
            <div className='PasswordInput__input-container'>
                <input className='PasswordInput__input'
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                />
                <button className='PasswordInput__toggle-button' type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
            {error && <div className='PasswordInput__error-message'><span>{error}</span></div>}
        </div> 
    );
}

export default PasswordInput;