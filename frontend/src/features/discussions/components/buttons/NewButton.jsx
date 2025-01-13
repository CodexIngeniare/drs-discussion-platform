import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './NewButton.css';

function NewButton({ link }){
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(link);
    };

    return (
        <button className='NewButton' onClick={handleClick}>
            <FontAwesomeIcon icon={faPlus}/>
            <label>New</label>
        </button>
    );
};

export default NewButton;