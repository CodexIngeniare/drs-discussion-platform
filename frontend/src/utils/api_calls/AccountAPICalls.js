export const login = async (email, password, loginEndpoint) => {
    try {
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const responseData = await response.json();
            return { success: true, data: responseData };
        } else {
            const errorData = await response.json();
            return { success: false, error: errorData };
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        return { success: false, error: error };
    }
};
export const GetUserData = async (token, endpoint) => {
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const errorData = await response.json();
            return { success: false, error: errorData };
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { success: false, error: error };
    }
};