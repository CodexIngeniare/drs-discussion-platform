import { useContext, useEffect } from 'react';
import { useComments } from '../../../../hooks';
import { DiscussionsContext } from '../../../../context';
import { CommentList, CommentInput } from './components';
import './CommentsView.css';

function CommentsView(){
    const { selectedDiscussion } = useContext(DiscussionsContext);
    const { comments, fetchComments } = useComments();

    useEffect(() => {
        if(!selectedDiscussion){
            return
        }
        fetchComments(selectedDiscussion.id);
    }, []);
    const refreshComments = () => {
        fetchComments(selectedDiscussion.id);
    };

    return (
        <div className='CommentsView'>
            <CommentList comments={comments} refreshComments={refreshComments}/>
            <CommentInput refreshComments={refreshComments}/>
        </div>
    );
};

export default CommentsView;