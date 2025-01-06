import './DiscussionListItem.css';

function DiscussionListItem ({ discussion }) {
    return (
        <div className='DiscussionListItem'>
            <div className='DiscussionListItem__header-container'>
                <div>
                    <label className='DiscussionListItem__topic'>{discussion.topic_name}</label>
                    <label className='DiscussionListItem__posted-by'> - posted by </label>
                    <label className='DiscussionListItem__author'>@AuthorUser</label>
                </div>
                <div>
                    <label className='DiscussionListItem__date'>{discussion.created_at.split("T")[0].replace(/-/g, '.')}</label>
                </div>
            </div>
            <div>
                <label className='DiscussionListItem__title'>{discussion.title}</label>
            </div>
        </div>
    );
};

export default DiscussionListItem;