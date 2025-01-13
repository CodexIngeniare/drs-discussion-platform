import { useContext } from 'react';
import { AuthContext } from '../../../context';

const useMentions = () => {
    const { token } = useContext(AuthContext);
    const createURL = 'http://localhost:5000/tag_user';

    const mentionUser = async (tagged_username, discussion_id, comment_id="") => {
        try{
            const response = await fetch(createURL, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tagged_username, discussion_id, comment_id }),
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
    const extractMentions = (content) => {
        const mentionRegex = /@(\w+)/g;
        const mentions = [...content.matchAll(mentionRegex)];
        return mentions.map(match => match[1]);
    }
    return { mentionUser, extractMentions };
};

export default useMentions;