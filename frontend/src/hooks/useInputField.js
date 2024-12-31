import { useState } from 'react';

const useInputField = (initValue = '', initValidity = false, validationFunction = () => {return { isValid:true, errorMessage:""}}, initRequired = false) => {
    const [value, setValue] = useState(initValue);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(initValidity);
    const [isRequired, setIsRequired] = useState(initRequired);

    const validate = () => {
        if(!ifRequired(value)){
            return;
        }

        const validationResult = validationFunction(value);
        if(validationResult.isValid) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
        setError(validationResult.errorMessage);
    };
    const ifRequired = (newValue) => {
        if(!isRequired){
            return true;
        }
        if(!newValue || newValue.trim() === ''){
            setIsValid(false);
            setError("Required.");
            return false;
        }
        return true;
    };
    const handleChange = (newValue) => {
        setValue(newValue);

        if(!ifRequired(newValue)){
            return;
        }

        const validationResult = validationFunction(newValue);
        if(validationResult.isValid){
            setIsValid(true);
        } else {
            setIsValid(false);
        }
        setError(validationResult.errorMessage);
    };

    return {
        value, setValue,
        error, setError,
        isValid, setIsValid,
        isRequired, setIsRequired,
        handleChange,
        validate,
    };
};

export default useInputField;