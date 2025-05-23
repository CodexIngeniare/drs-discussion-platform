import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscussionsContext } from '../../../../context';
import { useInputField } from '../../../../../../hooks';
import { useDiscussions, useMentions } from '../../../../hooks';
import { TopicInput, TitleInput, ContentInput } from '../../../form-inputs';
import { validateTitle, validateContent } from '../../../../../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './EditDiscussionForm.css';

function EditDiscussionForm (){
    const { selectedDiscussion } = useContext(DiscussionsContext);
    const navigate = useNavigate();
    const { updateDiscussion } = useDiscussions();
    const { mentionUser, extractMentions } = useMentions();
    const topic = useInputField("", false, () => {return { isValid:true, errorMessage:""}}, true);
    const title = useInputField("", false, validateTitle, true);
    const content = useInputField("", false, validateContent, true);

    useEffect(() => {
        if(!selectedDiscussion){
            return;
        }
        topic.setValue(`${selectedDiscussion.topic_id}`);
        title.setValue(`${selectedDiscussion.title}`);
        content.setValue(`${selectedDiscussion.content}`);
    }, [selectedDiscussion]);

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
    const handleEdit = async (e) => {
        e.preventDefault();
        if(!validateInputs()){
            return;
        }
        if(await updateDiscussion(selectedDiscussion.id, title.value, content.value, topic.value)){
            let mentionedUsers = extractMentions(content.value);
            mentionedUsers.forEach(taggedUser => {
            mentionUser(taggedUser, selectedDiscussion.id);
            });
            navigate("/dashboard/discussions/feed");
        }
    };
    const handleCancel = () => {
        navigate("/dashboard/discussions/read");
    };

    return (
        <div className='EditDiscussionForm'>
            <form className='EditDiscussionForm__input-fields'>
                <div className='EditDiscussionForm__header'>
                    <TopicInput setTopicID={topic.handleChange} initValue={topic.value}/>
                    <div className='EditDiscussionForm__buttons-container'>
                        <button className='EditDiscussionForm__cancel-button' onClick={handleCancel}>
                            <FontAwesomeIcon icon={faArrowLeft}/>
                            <label>Cancel</label>
                        </button>
                        <button className='EditDiscussionForm__create-button' onClick={handleEdit}>
                            <FontAwesomeIcon icon={faEdit}/>
                            <label>Save</label>
                        </button>
                    </div>
                </div>
                <TitleInput setTitle={title.handleChange} initValue={title.value}/>
                <ContentInput setContent={content.handleChange} initValue={content.value}/>
            </form>
        </div>
    );
};

export default EditDiscussionForm;