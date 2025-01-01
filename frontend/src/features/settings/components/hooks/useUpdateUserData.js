import { useState } from 'react';

const useUpdateUserData = (updateUserDataEndpoint) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateErrors, setUpdateErrors] = useState({});
    const token = sessionStorage.getItem("token");

    const updateAccount = async (email, username) => {
        setIsUpdating(true);
        try{
            const response = await fetch(updateUserDataEndpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username }),
            });
            if(response.ok){
                const data = await response.json();
                console.log(data);
                setIsUpdating(false);
                return true;
            } else {
                const errorData = await response.json();
                console.log(errorData);
                switch(errorData.message){
                    case 'Email already exists.':
                        setUpdateErrors({ email: "Email already exists." });
                        break;
                    case 'Username already exists.':
                        setUpdateErrors({ username: "Username already exists." });
                        break;
                    default:
                        break;
                }
                console.log(updateErrors);
                setIsUpdating(false);
                return false;
            }
        } catch(error){
            console.error('ERROR while updating account data: ', error);
            setIsUpdating(false);
            return false;
        }
    };
    const updatePersonalInfo = async (first_name, last_name, phone_number, country, city, address) => {
        setIsUpdating(true);
        try{
            const response = await fetch(updateUserDataEndpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ first_name, last_name, phone_number, country, city, address }),
            });
            if(response.ok){
                const data = await response.json();
                console.log(data);
                setIsUpdating(false);
                return true;
            } else {
                const errorData = await response.json();
                console.log(errorData);
                setIsUpdating(false);
                return false;
            }
        } catch(error){
            console.error('ERROR whilce updating personal info: ', error);
            setIsUpdating(false);
            return false;
        }
    };
    const updatePassword = async (old_password, new_password) => {
        setIsUpdating(true);
        try{
            const response = await fetch(updateUserDataEndpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ old_password, new_password }),
            });
            if(response.ok){
                const data = await response.json();
                console.log(data);
                setIsUpdating(false);
                return true;
            } else {
                const errorData = await response.json();
                console.log(errorData);
                switch(errorData.message){
                    case 'Old password is incorrect.':
                        setUpdateErrors({ oldPassword: "Incorrect password." });
                        break;
                    default:
                        break;
                }
                setIsUpdating(false);
                return false;
            }
        } catch(error){
            console.error('ERROR while updating password: ', error);
            setIsUpdating(false);
            return false;
        }
    };

    return { isUpdating, updateErrors, updateAccount, updatePersonalInfo, updatePassword };
};

export default useUpdateUserData;