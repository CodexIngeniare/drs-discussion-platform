import { useState, useContext } from 'react';
import { AuthContext } from '../../../../../context';

const useTopics = () => {
    const getURL = 'http://localhost:5000/get_all_topics';
    const createURL = 'http://localhost:5000/create_topic';
    const [topics, setTopics] = useState([]);
    const { token } = useContext(AuthContext);
    const [isCreating, setIsCreating] = useState(false);
    const [creationErrors, setCreationErrors] = useState({});

    const fetchTopics = async () => {
        try{
            const response = await fetch(getURL, {
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
    const createTopic = async (name, description) => {
        setIsCreating(true);
        try{
            const response = await fetch(createURL, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            });
            if(response.ok){
                //const msg = await response.json();
                setIsCreating(false);
                return true;
            } else {
                const error = await response.json();
                switch(error.error_code){
                    case "CONFLICT":
                        setCreationErrors({"name": "Topic already exists."});
                        break;
                    default:
                        break;
                }
                setIsCreating(false);
                return false;
            }
        } catch(error){
            setIsCreating(false);
            return false;
        }
    };

    return {
        topics, fetchTopics,
        isCreating, creationErrors, createTopic };
};

export default useTopics;