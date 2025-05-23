import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './DownVoteButton.css';

function DownVoteButton ({ downVoteCount, isDownVoted, handleClick, disabled=false }){
    return (
        <div className='DownVoteButton'>
            <button className={isDownVoted ? "DownVoteButton__down-voted" : "DownVoteButton__neutral"} onClick={handleClick} disabled={disabled}>
                <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <label>{downVoteCount}</label>
        </div>
    );
};

export default DownVoteButton;