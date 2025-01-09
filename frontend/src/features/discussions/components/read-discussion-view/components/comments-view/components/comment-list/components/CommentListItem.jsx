import { useState, useEffect } from 'react';
import { calcDateTimeSincePosted } from '../../../../../../../../../utils';
import './CommentListItem.css';

function CommentListItem({ comment }){
    const [postedDate, setPostedDate] = useState("");

    useEffect(() => {
        setPostedDate(calcDateTimeSincePosted(comment.created_at));
    }, []);

    return (
        <div className='CommentListItem'>
            <div className='CommentListItem__header'>
                <label className='CommentListItem__author'>@{comment.author_username}</label>
                <label className='CommentListItem__date'>{postedDate}</label>
            </div>
            <div>
                <p>{comment.content}</p>
            </div>
        </div>
    );
};

export default CommentListItem;