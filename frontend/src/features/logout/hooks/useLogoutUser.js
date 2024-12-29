import { useState } from 'react';

const useLogoutUser = (logoutEndpoint) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutErrors, setLogoutErrors] = useState({});

    const handleLogout = async (token) => {
        setIsLoggingOut(true);
        try{
            const response = await fetch(logoutEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            if(response.ok){
                const msg = await response.json();
                console.log(msg);
                setIsLoggingOut(false);
                return true;
            } else {
                const errorData = await response.json();
                const error_code = errorData.error_code;
                switch(error_code){
                    case "EMAIL_NOT_REGISTERED":
                        setLogoutErrors({ "email": "Email is not registered." });
                        break;
                    default:
                        break;
                }
                setIsLoggingOut(false);
                return false;
            }
        } catch(error){
            console.error('ERROR login call failed: ', error);
            setIsLoggingOut(false);
            return false;
        }
    };

    return { isLoggingOut, logoutErrors, handleLogout };
};

export default useLogoutUser;