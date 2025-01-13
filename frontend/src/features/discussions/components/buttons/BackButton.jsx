import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

function BackButton ({ link }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(link);
    };

    return (
        <button className='BackButton' onClick={handleClick}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }}/>
            Back
        </button>
    );
};

export default BackButton;