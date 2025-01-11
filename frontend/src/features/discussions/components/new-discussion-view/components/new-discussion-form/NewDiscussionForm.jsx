import { useNavigate } from 'react-router-dom';
import { useInputField } from '../../../../../../hooks';
import { useDiscussions } from '../../../../hooks';
import { validateTitle, validateContent } from '../../../../../../utils';
import { TopicInput, TitleInput, ContentInput } from '../../../form-inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './NewDiscussionForm.css';

function NewDiscussionForm (){
    const { createDiscussion } = useDiscussions();
    const navigate = useNavigate();
    const topic = useInputField("", false, () => {return { isValid:true, errorMessage:""}}, true);
    const title = useInputField("", false, validateTitle, true);
    const content = useInputField("", false, validateContent, true);

    const validateInputs = () => {
        let isValid = true;

        topic.validate();
        title.validate();
        content.validate();

        if(!topic.isValid){
            isValid = false;
        }
        if(!title.isValid){
            isValid = false;
        }
        if(!content.isValid){
            isValid = false;
        }
        return isValid;
    }
    const handleCreate = async () => {
        if(!validateInputs()){
            return;
        }
        if(await createDiscussion(title.value, content.value, topic.value)){
            navigate("/dashboard/discussions/feed");
        }
    };

    return (
        <div className='NewDiscussionForm'>
            <div className='NewDiscussionForm__input-fields'>
                <div className='NewDiscussionForm__header'>
                    <TopicInput setTopicID={topic.handleChange}/>
                    <button className='NewDiscussionForm__create-button' onClick={handleCreate}>
                        <FontAwesomeIcon icon={faPlus}/>
                        <label>Create</label>
                    </button>
                </div>
                <TitleInput setTitle={title.handleChange}/>
                <ContentInput setContent={content.handleChange} />
            </div>
        </div>
    );
};

export default NewDiscussionForm;