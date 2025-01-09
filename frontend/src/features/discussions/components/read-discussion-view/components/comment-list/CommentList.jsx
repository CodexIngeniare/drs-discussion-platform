import { CommentListItem } from './components';
import './CommentList.css';

function CommentList({ comments=[] }){
    return (
        <div className='CommentList'>
            {comments.map((comment, index) => (
                <CommentListItem comment={comment}/>
            ))}
        </div>
    );
};

export default CommentList;