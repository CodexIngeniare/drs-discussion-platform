import { useEffect, useState } from 'react';
import { TextInput, TextArea } from '../../../../../../components';
import { useInputField } from '../../../../../../hooks';
import { validateTopicName, validateTopicDescription } from '../../../../../../utils/input-validations';
import './EditTopicForm.css';

import { useTopics } from '../../hooks';

function EditTopicForm ({ cancel, selectedTopic }) {
    const { isUpdating, updateErrors, updateTopic, isDeleting, deleteTopic } = useTopics();
    const [id, setId] = useState("");
    const name = useInputField("", true, validateTopicName, true);
    const description = useInputField("", true, validateTopicDescription, true);

    useEffect(() => {
        setId(selectedTopic?.id);
        name.setValue(selectedTopic?.name);
        description.setValue(selectedTopic?.description);
    }, [selectedTopic]);
    useEffect(() => {
        name.setError(updateErrors.name);
    }, [updateErrors]);
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
    const handleUpdate = async () => {
        if(isUpdating){
            return;
        }
        if(!validateForm()){
            return;
        }
        if(await updateTopic(id, name.value, description.value)){
            cancel();
        }
    }
    const handleDelete = async () => {
        if(isDeleting){
            return;
        }
        if(await deleteTopic(id)){
            cancel();
        }
    };
    const handleCancel = () => {
        cancel();
    }

    return (
        <div className='EditTopicForm'>
            <div className='EditTopicForm__header-container'>
                <h1 className='EditTopicForm__header-title'>Edit Topic</h1>
                <hr/>
            </div>
            <div className='EditTopicForm__input-container'>
                <div className='EditTopicForm__credentials'>
                    <div className='EditTopicForm__id'>
                        <TextInput
                            label="ID"
                            value={id}
                            disabled={true}
                        />
                    </div>
                    <TextInput
                        label="Name"
                        value={name.value}
                        error={name.error}
                        handleChange={name.handleChange}
                        required={name.isRequired}
                        placeholder="enter topic name"
                    />
                </div>
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
            <div className='EditTopicForm__buttons-container'>
                <button className='EditTopicForm__cancel-button' onClick={handleCancel}>Cancel</button>
                <div className='EditTopicForm__update-delete-container'>
                    <button className='EditTopicForm__update-button' onClick={handleUpdate}>Update</button>
                    <button className='EditTopicForm__delete-button' onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default EditTopicForm;