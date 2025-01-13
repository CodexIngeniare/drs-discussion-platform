import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewDiscussionForm } from './components';
import './NewDiscussionView.css';

function NewDiscussionView(){
    const navigate = useNavigate();
    const [isCreated, setIsCreated] = useState(false);

    useEffect(() => {
        if(!isCreated){
            return;
        }
        navigate("/dashboard/discussions/feed");
    }, [isCreated]);
    return(
        <div className='NewDiscussionView'>
            <NewDiscussionForm setIsCreated={setIsCreated}/>
        </div>
    );
}

export default NewDiscussionView;