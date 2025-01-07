import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './DownVoteButton.css';

function DownVoteButton ({ discussion }){
    const [downVotes, setDownVotes] = useState("0");

    useEffect(() => {
        if(!discussion){
            return;
        }
        let downVoteCount = discussion.dislike_count
        if(downVoteCount){
            downVoteCount = 1400;
            if(downVoteCount < 1000){
                setDownVotes(downVoteCount);
            } else {
                setDownVotes(`${downVoteCount / 1000}k`);
            }
        }
    }, [discussion]);

    return (
        <div className='DownVoteButton'>
            <button className='DownVoteButton__button'><FontAwesomeIcon icon={faArrowDown} /></button>
            <label>{downVotes}</label>
        </div>
    );
};

export default DownVoteButton;