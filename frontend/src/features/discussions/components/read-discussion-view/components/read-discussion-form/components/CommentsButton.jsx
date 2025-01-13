import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import './CommentsButton.css';

function CommentsButton({ commentsCount, handleClick }){
    const onClick = () => {
        handleClick();
    };
    return (
        <div className='CommentsButton'>
            <button className='CommentsButton__button' onClick={onClick}>
                <FontAwesomeIcon icon={faComment}/>
            </button>
            <label>{commentsCount}</label>
        </div>
    );
}

export default CommentsButton;