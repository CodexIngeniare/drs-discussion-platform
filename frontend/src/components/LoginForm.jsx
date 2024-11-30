import React, { useState } from 'react';

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        setErrors(newErrors);
    };

    return (
        <div className="LoginForm">
            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor='email'>Email:</label></td>
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
                            <td></td>
                            <td><span>{errors.email}</span></td>
                        </tr>}
                        <tr>
                            <td><label htmlFor='password'>Password:</label></td>
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
                            <td></td>
                            <td><span>{errors.password}</span></td>
                        </tr>}
                        <tr>
                            <td></td>
                            <td><button type="submit">Login</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
  );
}

export default LoginForm;