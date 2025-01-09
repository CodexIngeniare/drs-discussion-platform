import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './DeleteButton.css';

function DeleteButton ({ link, handleDelete }) {
    const navigate = useNavigate();

    const handleClick = async () => {
        if(await handleDelete()){
            navigate(link);
        }
    };

    return (
        <button className='DeleteButton' onClick={handleClick}>
            <FontAwesomeIcon icon={faTrash}/>
            <label>Delete</label>
        </button>
    );
};

export default DeleteButton;