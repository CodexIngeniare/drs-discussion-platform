import { useState } from 'react';

function TextInput ({ label, value, error, placeholder, handleChange }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <div>
                <label>{label}</label>
            </div>
            <div className='login-password'>
                <input id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                />
                <button className='login-toggle-password' type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
            {error && <div className='error-message'><span>{error}</span></div>}
        </div> 
    );
}

export default TextInput;