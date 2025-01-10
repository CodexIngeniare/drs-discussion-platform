import { useState, useContext } from 'react';
import { AuthContext } from '../../../context';

const useComments = () => {
    const { token } = useContext(AuthContext);
    const getURL = 'http://localhost:5000/get_discussion_comments';
    //const createURL = 'http://localhost:5000/create_discussion';
    //const updateURL = 'http://localhost:5000/update_discussion';
    const deleteURL = 'http://localhost:5000/delete_comment';
    const [comments, setComments] = useState([]);

    const fetchComments = async (discussion_id) => {
        try{
            const url = `${getURL}?discussion_id=${discussion_id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                const msg = await response.json();
                setComments(msg.comments);
                return true;
            } else {
                setComments([]);
                return false;
            }
        } catch(error){
            setComments([]);
            return false;
        }
    };
    const deleteComment = async (comment_id) => {
        try{
            const response = await fetch(deleteURL, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment_id }),
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

    return {
        comments,
        fetchComments,
        deleteComment,
    };
};

export default useComments;