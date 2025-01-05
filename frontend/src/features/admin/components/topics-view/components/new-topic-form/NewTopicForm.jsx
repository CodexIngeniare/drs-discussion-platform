import { useEffect } from 'react';
import { TextInput, TextArea } from '../../../../../../components';
import { useInputField } from '../../../../../../hooks';
import { validateTopicName, validateTopicDescription } from '../../../../../../utils/input-validations';
import './NewTopicForm.css';

import { useTopics } from '../../hooks';

function NewTopicForm ({ cancel }) {
    const { isCreating, creationErrors, createTopic } = useTopics();
    const name = useInputField("", false, validateTopicName, true);
    const description = useInputField("", false, validateTopicDescription, true);

    useEffect(() => {
        name.setError(creationErrors.name);
    }, [creationErrors]);
    const validateForm = () => {
        let valid = true;
        name.validate();
        description.validate();

        if(!name.isValid){
            valid = false;
        }
        if(!description.isValid){
            valid = false;
        }
        return valid;
    }
    const handleCreate = async () => {
        if(isCreating){
            return;
        }
        if(!validateForm()){
            return;
        }
        if(await createTopic(name.value, description.value)){
            cancel();
        }
    }
    const handleCancel = () => {
        cancel();
    }

    return (
        <div className='NewTopicForm'>
            <div className='NewTopicForm__header-container'>
                <h1 className='NewTopicForm__header-title'>Create New Topic</h1>
                <hr/>
            </div>
            <div className='NewTopicForm__input-container'>
                <TextInput
                    label="Name"
                    value={name.value}
                    error={name.error}
                    handleChange={name.handleChange}
                    required={name.isRequired}
                    placeholder="enter topic name"
                />
                <TextArea
                    label="Description"
                    value={description.value}
                    error={description.error}
                    handleChange={description.handleChange}
                    rows={10}
                    required={description.isRequired}
                    placeholder="enter topic description"
                />
            </div>
            <div className='NewTopicForm__buttons-container'>
                <button className='NewTopicForm__cancel-button' onClick={handleCancel}>Cancel</button>
                <button className='NewTopicForm__create-button' onClick={handleCreate}>Create</button>
            </div>
        </div>
    );
};

export default NewTopicForm;