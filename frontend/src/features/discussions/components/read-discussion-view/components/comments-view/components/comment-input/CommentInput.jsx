import { useState, useContext, useRef } from 'react';
import { DiscussionsContext } from "../../../../../../context";
import { useComments } from '../../../../../../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './CommentInput.css';

function CommentInput ({ refreshComments=()=>{}}){
    const { selectedDiscussion } = useContext(DiscussionsContext);
    const {createComment } = useComments();
    const [commentContent, setCommentContent] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const textareaRef = useRef(null);

    const handleExpand = () => {
        if(!textareaRef.current){
            return;
        }
        if(isExpanded){
            setIsExpanded(false);
            textareaRef.current.style.height = "150px";
        } else {
            textareaRef.current.style.height = "500px";
            setIsExpanded(true);
        }
    }
    const handleSend = async (e) => {
        e.preventDefault();
    
        if(commentContent.trim() === ""){
            return;
        }
        if(await createComment(selectedDiscussion.id, commentContent)){
            setCommentContent("");
            refreshComments();
        }
    };

    return (
        <div className='CommentInput'>
            <div className='CommentInput__buttons'>
                <div>
                    <button className='CommentInput__expand-button' onClick={handleExpand}>
                        {isExpanded && <FontAwesomeIcon icon={faChevronUp}/>}
                        {!isExpanded && <FontAwesomeIcon icon={faChevronDown}/>}
                    </button>
                </div>
                <div>
                    <button className='CommentInput__send' onClick={handleSend}>
                        <label>Send</label>
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </button>
                </div>
            </div>
            <textarea
                className='CommentInput__input'
                ref={textareaRef}
                onChange={(e) => {setCommentContent(e.target.value)}}
                value={commentContent}
                placeholder='Type your thoughts to join discussion...'/>
        </div>
    );
};

export default CommentInput;