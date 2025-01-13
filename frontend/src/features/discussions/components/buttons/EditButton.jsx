import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './EditButton.css';

function EditButton ({ link }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(link);
    };

    return (
        <button className='EditButton' onClick={handleClick}>
            <FontAwesomeIcon icon={faEdit}/>
            <label>Edit</label>
        </button>
    );
};

export default EditButton;