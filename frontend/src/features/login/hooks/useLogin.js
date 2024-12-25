import useAuthenticateUser from './useAuthenticateUser.js'
import useFetchAccountData from './useFetchAccountData.js';

const useLogin = (authenticationEndpoint, accountDataEndpoint) => {
    const { isAuthenticating, authErrors, handleAuthentication } = useAuthenticateUser(authenticationEndpoint);
    const { isFetching, fetchErrors, fetchAccountData } = useFetchAccountData(accountDataEndpoint);

    const handleLogin = async (email, password) => {
        if (await handleAuthentication(email, password)) {
            const token = sessionStorage.getItem("token");
            if (await fetchAccountData(token)) {
                return true;
            }
        }
        return false;
    };

    return {
        isLoggingIn: isAuthenticating || isFetching,
        loginErrors: {
            authErrors,
            fetchErrors
        }, 
        handleLogin
    };
};

export default useLogin;