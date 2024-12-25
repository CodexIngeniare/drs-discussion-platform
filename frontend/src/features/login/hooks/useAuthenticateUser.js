import { useState } from 'react';

const useAuthenticateUser = (authenticateEndpoint) => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authErrors, setAuthErrors] = useState({});

    const handleAuthentication = async (email, password) => {
        setIsAuthenticating(true);
        try{
            const response = await fetch(authenticateEndpoint, {
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
                setIsAuthenticating(false);
                return true;
            } else {
                const errorData = await response.json();
                const error_code = errorData.error_code;
                switch(error_code){
                    case "EMAIL_NOT_REGISTERED":
                        setAuthErrors({ "email": "Email is not registered." });
                        break;
                    case "INVALID_PASSWORD":
                        setAuthErrors({ "password": "Incorrect password." });
                        break;
                    default:
                        break;
                }
                setIsAuthenticating(false);
                return false;
            }
        } catch(error){
            console.error('ERROR login call failed: ', error);
            setIsAuthenticating(false);
            return false;
        }
    };

    return { isAuthenticating, authErrors, handleAuthentication };
};

export default useAuthenticateUser;