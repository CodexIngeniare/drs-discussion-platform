import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../../../../../../context';
import { DiscussionsContext } from '../../../../../../../context';
import { calcDateTimeSincePosted } from '../../../../../../../../../utils';
import DeleteCommentButton from './DeleteCommentButton.jsx';
import './CommentListItem.css';

function CommentListItem({ comment, refreshComments }){
    const { userID, userRole } = useContext(AuthContext);
    const { selectedDiscussion } = useContext(DiscussionsContext);
    const [postedDate, setPostedDate] = useState("");
    const [hasAdminPerm, setHasAdminPerm] = useState(false);
    const [hasDiscussionAuthorPerm, setHasDiscussionAuthorPerm] = useState(false);
    const [hasCommentAuthorPerm, setHasCommentAuthorPerm] = useState(false);

    useEffect(() => {
        if(userRole === "admin"){
            setHasAdminPerm(true);
        } else {
            setHasAdminPerm(false);
        }
        if(userID === selectedDiscussion.user_id){
            setHasDiscussionAuthorPerm(true);
        } else {
            setHasDiscussionAuthorPerm(false);
        }
        if(comment.user_id === userID){
            setHasCommentAuthorPerm(true);
        } else {
            setHasCommentAuthorPerm(false);
        }
        setPostedDate(calcDateTimeSincePosted(comment.created_at));
    }, [comment]);

    return (
        <div className='CommentListItem'>
            <div className='CommentListItem__header'>
                <div className='CommentListItem__author-date-container'>
                    <label className='CommentListItem__author'>@{comment.author_username}</label>
                    <label className='CommentListItem__date'>{postedDate}</label>
                </div>
                {(hasAdminPerm || hasDiscussionAuthorPerm || hasCommentAuthorPerm) && <DeleteCommentButton comment_id={comment.id} refreshComments={refreshComments}/>}
            </div>
            <div>
                <p>{comment.content}</p>
            </div>
        </div>
    );
};

export default CommentListItem;