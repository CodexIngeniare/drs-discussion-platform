import { useState } from "react";

const useFetchAccountData = (accountDataEndpoint) => {
    const [isFetching, setIsFetching] = useState(false);
    const [fetchErrors, setFetchErrors] = useState({});

    const fetchAccountData = async (token) => {
        setIsFetching(true);
        try{  
            const response = await fetch(accountDataEndpoint, {
                method: "GET",
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                const data = await response.json();
                sessionStorage.setItem("user", JSON.stringify(data));
                setIsFetching(false);
                return true;
            } else {
                const errorData = await response.json();
                const error_code = errorData.error_code;
                switch(error_code){
                    case "UNAUTHORIZED":
                        setFetchErrors({ "token": "Invalid or expired token." });
                        console.error("Error fetching user data: ", fetchErrors);
                        break;
                    default:
                        break;
                }
                setIsFetching(false);
                return false;
            }
        } catch(error){
            console.error("Error fetching user data: ", error);
            setIsFetching(false);
            return false;
        }
    };

    return { isFetching, fetchErrors, fetchAccountData };
};

export default useFetchAccountData;