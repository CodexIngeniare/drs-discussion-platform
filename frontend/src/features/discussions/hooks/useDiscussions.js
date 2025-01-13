import { useState, useContext } from 'react';
import { AuthContext } from '../../../context';

const useDiscussions = () => {
    const { token } = useContext(AuthContext);
    const getURL = 'http://localhost:5000/get_all_discussions';
    const createURL = 'http://localhost:5000/create_discussion';
    const updateURL = 'http://localhost:5000/update_discussion';
    const deleteURL = 'http://localhost:5000/delete_discussion';
    const searchURL = 'http://localhost:5000/search_discussions';
    const [discussions, setDiscussions] = useState([]);
    const [newDiscussion, setNewDiscussion] = useState(null);

    const fetchDiscussions = async () => {
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
                setDiscussions(msg.discussions);
                return true;
            } else {
                //const error = await response.json();
                return false;
            }
        } catch(error){
            return false;
        }
    };
    const createDiscussion = async ( title, content, topic_id) => {
        try{
            const response = await fetch(createURL, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, topic_id }),
            });
            if(response.ok){
                const msg = await response.json();
                setNewDiscussion(msg.discussion);
                return true;
            } else {
                //const error = await response.json();
                setNewDiscussion(null);
                return false;
            }
        } catch(error){
            setNewDiscussion(null);
            return false;
        }
    };
    const updateDiscussion = async (discussion_id, title, content, topic_id) => {
        try{
            const response = await fetch(updateURL, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ discussion_id, title, content, topic_id }),
            });
            if(response.ok){
                //const msg = await response.json();
                return true;
            } else {
                //const error = await response.json();
                return false;
            }
        } catch(error){
            return false;
        }
    };
    const deleteDiscussion = async (discussion_id) => {
        try{
            const response = await fetch(deleteURL, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ discussion_id }),
            });
            if(response.ok){
                //const msg = await response.json();
                return true;
            } else {
                //const error = await response.json();
                return false;
            }
        } catch(error){
            return false;
        }
    };
    const searchDiscussions = async (topic_id, author_username, author_email, discussion_title) => {
        try{
            const url = `${searchURL}?topic_id=${topic_id}&author_username=${author_username}&author_email=${author_email}&discussion_title=${discussion_title}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                const msg = await response.json();
                setDiscussions(msg.discussions);
                return true;
            } else {
                //const error = await response.json();
                setDiscussions([]);
                return false;
            }
        } catch(error){
            setDiscussions([]);
            return false;
        }
    };

    return {
        discussions,
        newDiscussion, setNewDiscussion,
        fetchDiscussions,
        createDiscussion,
        updateDiscussion,
        deleteDiscussion,
        searchDiscussions,
    };
};

export default useDiscussions;