import { CommentListItem } from './components';
import './CommentList.css';

function CommentList({ comments=[], refreshComments=()=>{} }){
    return (
        <div className='CommentList'>
            {comments.map((comment, index) => (
                <CommentListItem comment={comment} refreshComments={refreshComments}/>
            ))}
        </div>
    );
};

export default CommentList;