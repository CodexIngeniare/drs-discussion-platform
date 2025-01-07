import { useState, useEffect, useContext } from 'react';
import { DiscussionsContext } from '../../../../../context';
import UpVoteButton from './UpVoteButton.jsx';
import DownVoteButton from './DownVoteButton.jsx';
import './DiscussionListItem.css';

function DiscussionListItem ({ discussion }) {
    const { setSelectedDiscussion } = useContext(DiscussionsContext);
    const [postedDate, setPostedDate] = useState("");

    useEffect(() => {
        if(!discussion){
            return;
        }
        calculateDate();
    }, [discussion]);

    const handleSelect = () => {
        setSelectedDiscussion(discussion);
    };
    const calculateDate = () => {
        const postDate = new Date(discussion.created_at);
        const currentDate = new Date();

        const differenceInSeconds = Math.floor((currentDate - postDate) / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);

        let date = postDate.toISOString().split("T")[0];
        if(differenceInDays < 10){
            date = `${differenceInDays} days ago`;
        }
        if(differenceInHours < 24){
            const minutesAgo = differenceInMinutes % 60;
            date = `${differenceInHours}h and ${minutesAgo}min ago`;
        }
        if(differenceInMinutes < 60){
            date = `${differenceInMinutes}min ago`;
        }
        if(differenceInSeconds < 60){
            date = `${differenceInSeconds}s ago`;
        }
        setPostedDate(date);
    };

    return (
        <div className='DiscussionListItem' onClick={handleSelect}>
            <div className='DiscussionListItem__vote-buttons-container'>
                <UpVoteButton discussion={discussion}/>
                <DownVoteButton discussion={discussion}/>
            </div>
            <div className='DiscussionListItem__main-container'>
                <div className='DiscussionListItem__header-container'>
                    <div>
                        <label className='DiscussionListItem__topic'>{discussion.topic_name}</label>
                        <label className='DiscussionListItem__posted-by'> - posted by </label>
                        <label className='DiscussionListItem__author'>@AuthorUser</label>
                    </div>
                    <div>
                        <label className='DiscussionListItem__date'>{postedDate}</label>
                    </div>
                </div>
                <div>
                    <p className='DiscussionListItem__title'>{discussion.title}</p>
                </div>
            </div>
        </div>
    );
};

export default DiscussionListItem;