
const useFetchUserData = (userDataEndpoint) => {

    const fetchUserData = async (token) => {
        try{  
            const response = await fetch(userDataEndpoint, {
                method: "GET",
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                const data = await response.json();
                sessionStorage.setItem("user", JSON.stringify(data));
                return true;
            } else {
                // error handling
            }
        } catch(error){
            console.error("Error fetching user data: ", error);
            return false;
        }
    };

    return { fetchUserData };
};

export default useFetchUserData;