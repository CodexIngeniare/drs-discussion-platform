import { useState, useContext } from 'react';
import { AuthContext } from '../../../../../context';

const useTopics = (url) => {
    const [topics, setTopics] = useState([]);
    const { token } = useContext(AuthContext);

    const fetchTopics = async () => {
        try{
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                const msg = await response.json();
                setTopics(msg.topics);
                return true;
            } else {
                const error = await response.json();
                return false;
            }
        } catch(error){
            return false;
        }
    };

    return { topics, fetchTopics };
};

export default useTopics;