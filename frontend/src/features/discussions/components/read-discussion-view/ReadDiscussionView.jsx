import { useState, useEffect, useContext } from 'react';
import { useDiscussions, useComments } from '../../hooks';
import { AuthContext } from '../../../../context';
import { DiscussionsContext } from '../../context';
import { ReadDiscussionForm, CommentList } from './components';
import { BackButton, EditButton, DeleteButton } from '../buttons';
import './ReadDiscussionView.css';

function ReadDiscussionView () {
    const { deleteDiscussion } = useDiscussions();
    const { comments, fetchComments } = useComments();
    const { userID, userRole } = useContext(AuthContext);
    const { selectedDiscussion } = useContext(DiscussionsContext);
    const [hasAuthorPerm, setHasAuthorPerm] = useState(false);
    const [hasAdminPerm, setHasAdminPerm] = useState(false);

    useEffect(() => {
        if(!selectedDiscussion){
        }
        fetchComments(selectedDiscussion.id);

        if(selectedDiscussion.user_id === userID){
            setHasAuthorPerm(true);
        }
        if(userRole === "admin"){
            setHasAdminPerm(true);
        }
    }, []);
    const handleDelete = async () => {
        if(await deleteDiscussion(selectedDiscussion.id)){
            return true;
        }
        return false;
    };

    return (
        <div className='ReadDiscussionView'>
            <section className='ReadDiscussionView__discussion-section'>
                <div className='ReadDiscussionView__buttons'>
                    <div>
                        <BackButton link="/dashboard/discussions/feed"/>
                    </div>
                    <div className='ReadDiscussionView__option-buttons'>
                        {(hasAuthorPerm || hasAdminPerm) && <EditButton link="/dashboard/discussions/feed"/>}
                        {(hasAuthorPerm || hasAdminPerm) && <DeleteButton link="/dashboard/discussions/feed" handleDelete={handleDelete}/>}
                    </div>
                </div>
                <ReadDiscussionForm/>
            </section>
            <section className='ReadDiscussionView__comments-section'>
                <CommentList comments={comments}/>
            </section>
        </div>
    );
};

export default ReadDiscussionView;
