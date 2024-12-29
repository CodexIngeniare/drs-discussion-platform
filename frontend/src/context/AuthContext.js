import React, {createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ( { children }) => {
    const [token, setToken] = useState(null);
    const [userRole, setUserRole] = useState("user");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        const storedUserData = sessionStorage.getItem("user");

        if(storedToken){
            setToken(storedToken);
        }

        if(storedUserData){
            try{
                const userData = JSON.parse(storedUserData).user;

                setUserRole(userData.is_admin === "true" ? "admin" : "user");
                setUsername(userData.username);
                setEmail(userData.email);
                setFirstname(userData.first_name);
                setLastName(userData.last_name);
                setPhoneNumber(userData.phone_number);
                setCountry(userData.country);
                setCity(userData.city);
                setAddress(userData.address);
            } catch (error){
                console.error("Error parsing stored user data: ", error);
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            token, setToken,
            userRole, setUserRole,
            username, setUsername,
            email, setEmail,
            firstName, setFirstname,
            lastName, setLastName,
            phoneNumber, setPhoneNumber,
            country, setCountry,
            city, setCity,
            address, setAddress
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;