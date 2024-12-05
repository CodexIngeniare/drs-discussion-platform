import React, { useState } from 'react';

function LoginForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateEmail = (newErrors) => {
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email.";
        }
    };
    const validatePassword = (newErrors) => {
        if (!password) {
            newErrors.password = "Password is required.";
        }
    };
    const validateForm = () => {
        const newErrors = {};

        validateEmail(newErrors);
        validatePassword(newErrors);

        setErrors(newErrors);

        if(Object.keys(newErrors).length === 0)
            return true;

        return false;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch(props.apiLoginEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
    
                if (response.ok) {
                    const responseData = await response.json();
                    const token = responseData.token
                    //console.log(`token: ${token}`);
                } else {
                    const errorData = await response.json();
                    if(errorData.error_code === "EMAIL_NOT_REGISTERED")
                    {
                        setErrors({"email": "email is not registered."})
                    }
                    if(errorData.error_code === "INVALID_PASSWORD")
                        {
                            setErrors({"password": "incorrect password."})
                        }
                    //console.log(errorData)
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };

    return (
        <div className="LoginForm">
            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor='email'>Email:</label></td>
                        </tr>
                        <tr>
                            <td>
                                <input id="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </td>
                        </tr>
                        {errors.email &&
                        <tr>
                            <td><span className='error-message'>{errors.email}</span></td>
                        </tr>}
                        <tr>
                            <td><label htmlFor='password'>Password:</label></td>
                        </tr>
                        <tr>
                            <td>
                                <input id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </td>
                        </tr>
                        {errors.password &&
                        <tr>
                            <td><span className='error-message'>{errors.password}</span></td>
                        </tr>}
                        <tr>
                            <td><button type="submit">Login</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
  );
}

export default LoginForm;