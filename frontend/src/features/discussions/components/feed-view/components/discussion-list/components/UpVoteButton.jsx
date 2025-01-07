import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import './UpVoteButton.css';

function UpVoteButton ({ discussion }){
    const [upVotes, setUpVotes] = useState(0);

    useEffect(() => {
        if(!discussion){
            return;
        }
        if(discussion.like_count){
            setUpVotes(discussion.like_count);
        }
    }, [discussion]);

    return (
        <div className='UpVoteButton'>
            <button className='UpVoteButton__button'><FontAwesomeIcon icon={faArrowUp} /></button>
            <label>{upVotes}</label>
        </div>
    );
};

export default UpVoteButton;