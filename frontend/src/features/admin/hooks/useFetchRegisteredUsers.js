
const useFetchRegisteredUsers = (accountDataEndpoint) => {

    const fetchRegisteredUsers = async () => {
        try{  
            const token = localStorage.getItem("token");
            const response = await fetch(accountDataEndpoint, {
                method: "GET",
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                const data = await response.json();
                console.log(data);
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

    return { fetchRegisteredUsers };
};

export default useFetchRegisteredUsers;