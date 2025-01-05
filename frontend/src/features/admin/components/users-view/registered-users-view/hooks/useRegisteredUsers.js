import { useState, useContext } from "react";
import { AuthContext } from '../../../../../../context';

const useRegisteredUsers = (url) => {
    const { token } = useContext(AuthContext);
    const [registeredUsers, setRegisteredUsers] = useState([]);

    const fetchRegisteredUsers = async () => {
        try{  
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                const data = await response.json();
                console.log(data);
                setRegisteredUsers(data);
                return true;
            } else {
                const errorData = await response.json();
                console.log(errorData);
                return false;
            }
        } catch(error){
            console.error("Error fetching user data: ", error);
            return false;
        }
    };

    return { registeredUsers, fetchRegisteredUsers };
};

export default useRegisteredUsers;