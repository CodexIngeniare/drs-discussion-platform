import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import './UpVoteButton.css';

function UpVoteButton ({ upVoteCount, isUpVoted, handleClick, disabled=false }){

    return (
        <div className='UpVoteButton'>
            <button className={isUpVoted ? "UpVoteButton__up-voted" : "UpVoteButton__neutral"} onClick={handleClick} disabled={disabled}>
                <FontAwesomeIcon icon={faArrowUp} />
            </button>
            <label>{upVoteCount}</label>
        </div>
    );
};

export default UpVoteButton;