import { useState } from 'react';
import { useComments } from '../../../../../../../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import './DeleteCommentButton.css';

function DeleteCommentButton({ comment_id=null, refreshComments }){
    const { deleteComment } = useComments();
    const [isDeleteClicked, setIsDeleteClicked] = useState(false);

    const handleClick = async () => {
        if(!comment_id){
            return;
        }
        setIsDeleteClicked(true);
        /*if(await deleteComment(comment_id)){
            refreshComments();
        }*/
    };
    const handleConfirmDelete = async () => {
        if(!comment_id){
            return;
        }
        if(await deleteComment(comment_id)){
            refreshComments();
            setIsDeleteClicked(false);
        }
    };
    const handleRejectDelete = async () => {
        setIsDeleteClicked(false);
    };
    return (
        <div className='DeleteCommentButton'>
            {(!isDeleteClicked) &&
            <button className='DeleteCommentButton__delete-button' onClick={handleClick}>
                <FontAwesomeIcon icon={faMinus}/>
            </button>
            }
            {(isDeleteClicked) &&
            <div className='DeleteCommentButton__confirm-container'>
                <button className='DeleteCommentButton__delete-confirm-button' onClick={handleConfirmDelete}>
                    <FontAwesomeIcon icon={faCheck}/>
                </button>
                <button className='DeleteCommentButton__delete-reject-button' onClick={handleRejectDelete}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            </div>
            }
        </div>
    );
}

export default DeleteCommentButton;