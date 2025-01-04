//import { useState } from 'react';

const useTopics = (url) => {
    //const [topics, setTopics] = useState([]);
    const token = sessionStorage.getItem('token');

    const fetchTopics = async () => {
        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            if(response.ok){
                const msg = await response.json();
                console.log(msg);
                return true;
            } else {
                const error = await response.json();
                console.log(error);
                return false;
            }
        } catch(error){
            return false;
        }
    };

    return { /*topics,*/ fetchTopics };
};

export default useTopics;