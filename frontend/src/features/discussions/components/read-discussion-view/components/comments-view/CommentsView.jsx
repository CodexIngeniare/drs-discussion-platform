import { CommentList } from './components';
import './CommentsView.css';

function CommentsView({ comments=[] }){
    return (
        <div className='CommentsView'>
            <CommentList comments={comments}/>
        </div>
    );
};

export default CommentsView;