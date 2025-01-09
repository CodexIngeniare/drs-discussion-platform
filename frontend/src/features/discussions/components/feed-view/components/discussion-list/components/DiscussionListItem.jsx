import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscussionsContext } from '../../../../../context';
import { VoteButtons } from '../../../../buttons';
import { calcDateTimeSincePosted } from '../../../../../../../utils';
import './DiscussionListItem.css';

function DiscussionListItem ({ discussion }) {
    const { setSelectedDiscussion } = useContext(DiscussionsContext);
    const navigate = useNavigate();
    const [postedDate, setPostedDate] = useState("");

    useEffect(() => {
        if(!discussion){
            return;
        }
        setPostedDate(calcDateTimeSincePosted(discussion.created_at));
    }, [discussion]);

    const handleSelect = () => {
        setSelectedDiscussion(discussion);
        navigate("/dashboard/discussions/read");
    };

    return (
        <div className='DiscussionListItem'>
            <div className='DiscussionListItem__vote-buttons-container'>
                <VoteButtons discussion={discussion} disabled={true}/>
            </div>
            <div className='DiscussionListItem__main-container' onClick={handleSelect}>
                <div className='DiscussionListItem__header-container'>
                    <div>
                        <label className='DiscussionListItem__topic'>{discussion.topic_name}</label>
                        <label className='DiscussionListItem__posted-by'> - posted by </label>
                        <label className='DiscussionListItem__author'>@{discussion.author_username}</label>
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