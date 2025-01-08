import { useState, useEffect } from 'react';
import { useVote } from './hooks';
import { UpVoteButton, DownVoteButton } from './components';
import './VoteButtons.css';

function VoteButtons ({ discussion }) {
    const { upVote, downVote, unVote } = useVote();
    const [upVotes, setUpVotes] = useState(0);
    const [isUpVoted, setIsUpVoted] = useState(false);
    const [downVotes, setDownVotes] = useState(0);
    const [isDownVoted, setIsDownVoted] = useState(false);

    useEffect(() => {
        if(!discussion){
            return;
        }
        if(discussion.vote_status === "liked"){
            setIsUpVoted(true);
        }
        if(discussion.vote_status === "disliked"){
            setIsDownVoted(true);
        }

        let upVoteCount = discussion.like_count;
        if(upVoteCount){
            if(upVoteCount < 1000){
                setUpVotes(upVoteCount);
            } else {
                setUpVotes(`${upVoteCount / 1000}k`);
            }
        }
        let downVoteCount = discussion.dislike_count
        if(downVoteCount){
            if(downVoteCount < 1000){
                setDownVotes(downVoteCount);
            } else {
                setDownVotes(`${downVoteCount / 1000}k`);
            }
        }
    }, [discussion]);
    const upVoteClick = async () => {
        if(isUpVoted){
            if(await unVote(discussion.id)){
                setIsUpVoted(false);
                setUpVotes(upVotes - 1);
            }
        } else {
            if(await upVote(discussion.id)){
                if(isDownVoted){
                    setIsDownVoted(false);
                    setDownVotes(downVotes - 1);
                }
                setIsUpVoted(true);
                setUpVotes(upVotes + 1);
            }
        }
    };
    const downVoteClick = async () => {
        if(isDownVoted){
            if(await unVote(discussion.id)){
                setIsDownVoted(false);
                setDownVotes(downVotes - 1);
            }
        } else{
            if(await downVote(discussion.id)){
                if(isUpVoted){
                    setIsUpVoted(false);
                    setUpVotes(upVotes - 1);
                }
                setIsDownVoted(true);
                setDownVotes(downVotes + 1);
            }
        }
    };

    return (
        <div className='VoteButtons'>
            <UpVoteButton upVoteCount={upVotes} isUpVoted={isUpVoted} handleClick={upVoteClick}/>
            <DownVoteButton downVoteCount={downVotes} isDownVoted={isDownVoted} handleClick={downVoteClick}/>
        </div>
    );
};

export default VoteButtons;
