import { useState, useContext } from 'react';
import { AuthContext } from '../../../../../context';

const useTopics = () => {
    const getURL = 'http://localhost:5000/get_all_topics';
    const createURL = 'http://localhost:5000/create_topic';
    const updateURL = 'http://localhost:5000/update_topic';
    const deleteURL = 'http://localhost:5000/delete_topic';
    const [topics, setTopics] = useState([]);
    const { token } = useContext(AuthContext);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [creationErrors, setCreationErrors] = useState({});
    const [updateErrors, setUpdateErrors] = useState({});

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
    const updateTopic = async (topic_id, name, description) => {
        setIsUpdating(true);
        try{
            const response = await fetch(updateURL, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic_id, name, description }),
            });
            if(response.ok){
                setIsUpdating(false);
                return true;
            } else {
                const error = await response.json();
                switch(error.error_code){
                    case "CONFLICT":
                        setUpdateErrors({"name": "Topic already exists."});
                        break;
                    default:
                        break;
                }
                setIsUpdating(false);
                return false;
            }
        } catch(error){
            setIsUpdating(false);
            return false;
        }
    };
    const deleteTopic = async (topic_id) => {
        setIsDeleting(true);
        try{
            const response = await fetch(deleteURL, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic_id }),
            });
            if(response.ok){
                setIsDeleting(false);
                return true;
            } else {
                //const error = await response.json();
                setIsDeleting(false);
                return false;
            }
        } catch(error){
            setIsDeleting(false);
            return false;
        }
    };

    return {
        topics, fetchTopics,
        isCreating, creationErrors, createTopic,
        isUpdating, updateErrors, updateTopic,
        isDeleting, deleteTopic,
    };
};

export default useTopics;