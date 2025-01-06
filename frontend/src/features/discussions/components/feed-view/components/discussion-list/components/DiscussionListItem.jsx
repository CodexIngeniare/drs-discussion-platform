import './DiscussionListItem.css';

function DiscussionListItem ({ discussion }) {
    return (
        <div className='DiscussionListItem'>
            <label>{discussion.topic_name}</label>
            <label>{discussion.title}</label>
        </div>
    );
};

export default DiscussionListItem;