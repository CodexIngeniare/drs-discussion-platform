
const useRegistrationApproval = (approve_url, reject_url) => {
    const approveUser = async (user_id) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(approve_url, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return true;
            }
            else{
                const errorData = await response.json();
                console.log(errorData);
                return false;
            }
        } catch (error) {
            console.error('Failed to approve user:', error);
            return false;
        }
    };
    const disapproveUser = async (user_id) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(reject_url, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return true;
            }
            else{
                const errorData = await response.json();
                console.log(errorData);
                return false;
            }
        } catch (error) {
            console.error('Failed to reject user:', error);
            return false;
        }
    };

    return { approveUser, disapproveUser };
};

export default useRegistrationApproval;