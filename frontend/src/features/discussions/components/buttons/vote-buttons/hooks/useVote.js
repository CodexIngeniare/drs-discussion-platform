import { useContext } from 'react';
import { AuthContext } from '../../../../../../context';

const useVote = () => {
    const { token } = useContext(AuthContext);
    const url = 'http://localhost:5000/like_discussion';
    const upVoted = "like";
    const downVoted = "dislike";
    const neutral = "neutral";

    const upVote = async (discussion_id) => {
        try{
            const status = upVoted;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ discussion_id, status }),
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
    const downVote = async (discussion_id) => {
        try{
            const status = downVoted;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ discussion_id, status }),
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
    const unVote = async (discussion_id) => {
        try{
            const status = neutral;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ discussion_id, status }),
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

    return { upVote, downVote, unVote };
};

export default useVote;