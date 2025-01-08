import { useContext, useEffect, useState } from 'react';
import { DiscussionsContext } from '../../../../context';
import { VoteButtons } from '../../../buttons';
import './ReadDiscussionForm.css';

function ReadDiscussionForm(){
    const { selectedDiscussion } = useContext(DiscussionsContext);
    const [postedDate, setPostedDate] = useState("");

    useEffect(() => {
        calculateDate();
    }, []);
    const calculateDate = () => {
        const postDate = new Date(selectedDiscussion.created_at);
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
        <div className='ReadDiscussionForm'>
            <div className='ReadDiscussionForm__vote-buttons'>
                <VoteButtons discussion={selectedDiscussion}/>
            </div>
            <div className='ReadDiscussionForm__main'>
                <div className='ReadDiscussionForm__header'>
                    <div>
                        <label className='ReadDiscussionForm__topic'>{selectedDiscussion.topic_name}</label>
                        <label className='ReadDiscussionForm__posted-by'> - posted by </label>
                        <label className='ReadDiscussionForm__author'>@{selectedDiscussion.author_username}</label>
                    </div>
                    <div>
                        <label className='ReadDiscussionForm__date'>{postedDate}</label>
                    </div>
                </div>
                <div>
                    <p className='ReadDiscussionForm__title'>{selectedDiscussion.title}</p>
                    <hr/>
                    <p className='ReadDiscussionForm__content'>{selectedDiscussion.content}</p>
                </div>
            </div>
        </div>
    );
};

export default ReadDiscussionForm;