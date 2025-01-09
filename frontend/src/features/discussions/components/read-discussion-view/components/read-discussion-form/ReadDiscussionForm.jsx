import { useContext, useEffect, useState } from 'react';
import { DiscussionsContext } from '../../../../context';
import { VoteButtons } from '../../../buttons';
import { calcDateTimeSincePosted } from '../../../../../../utils';
import './ReadDiscussionForm.css';

function ReadDiscussionForm(){
    const { selectedDiscussion } = useContext(DiscussionsContext);
    const [postedDate, setPostedDate] = useState("");

    useEffect(() => {
        setPostedDate(calcDateTimeSincePosted(selectedDiscussion.created_at));
    }, []);

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