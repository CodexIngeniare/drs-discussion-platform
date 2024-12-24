import { useState } from 'react';

const useLogin = (loginEndpoint) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginErrors, setLoginErrors] = useState({});

    const handleLogin = async (email, password) => {
        setIsSubmitting(true);
        try{
            const response = await fetch(loginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if(response.ok){
                const data = await response.json();
                const token = data.token;
                sessionStorage.setItem('token', token);
                console.log('LOGIN token: ', token);
                setIsSubmitting(false);
                return true;
            } else {
                const errorData = await response.json();
                const error_code = errorData.error_code;
                switch(error_code){
                    case "EMAIL_NOT_REGISTERED":
                        setLoginErrors({ "email": "Email is not registered." });
                        break;
                    case "INVALID_PASSWORD":
                        setLoginErrors({ "password": "Incorrect password." });
                        break;
                    default:
                        break;
                }
                setIsSubmitting(false);
                return false;
            }
        } catch(error){
            console.error('ERROR login call failed: ', error);
            setIsSubmitting(false);
            return false;
        }
    };

    return { isSubmitting, loginErrors, handleLogin };
};

export default useLogin;