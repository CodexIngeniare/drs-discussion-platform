import { useEffect } from 'react';
import { useInputField } from '../../../../../../hooks';
import { useDiscussions, useMentions } from '../../../../hooks';
import { validateTitle, validateContent } from '../../../../../../utils';
import { TopicInput, TitleInput, ContentInput } from '../../../form-inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './NewDiscussionForm.css';

function NewDiscussionForm ({ setIsCreated = () => {}}){
    const { newDiscussion, createDiscussion } = useDiscussions();
    const { mentionUser, extractMentions } = useMentions();
    const topic = useInputField("", false, () => {return { isValid:true, errorMessage:""}}, true);
    const title = useInputField("", false, validateTitle, true);
    const content = useInputField("", false, validateContent, true);

    useEffect(()=>{
        if(!newDiscussion){
            return;
        }
        let mentionedUsers = extractMentions(newDiscussion.content);
        mentionedUsers.forEach(taggedUser => {
            mentionUser(taggedUser, newDiscussion.id);
        });
        setIsCreated(true);
    }, [newDiscussion]);
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
        }
    };

    return (
        <div className='NewDiscussionForm'>
            <div className='NewDiscussionForm__input-fields'>
                <div className='NewDiscussionForm__header'>
                    <TopicInput setTopicID={topic.handleChange} initValue={topic.value}/>
                    <button className='NewDiscussionForm__create-button' onClick={handleCreate}>
                        <FontAwesomeIcon icon={faPlus}/>
                        <label>Create</label>
                    </button>
                </div>
                <TitleInput setTitle={title.handleChange} initValue={title.value}/>
                <ContentInput setContent={content.handleChange} initValue={content.value}/>
            </div>
        </div>
    );
};

export default NewDiscussionForm;