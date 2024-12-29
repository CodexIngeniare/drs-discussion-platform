import { useState } from 'react';

const useInputField = (initialValue = '', initialValidity = false, validationFunction = () => {}) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(initialValidity);

    const validate = () => {
        const validationResult = validationFunction(value);
        if(validationResult.isValid) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
        setError(validationResult.errorMessage);
    };

    const handleChange = (newValue) => {
        setValue(newValue);

        const validationResult = validationFunction(newValue);
        if(validationResult.isValid){
            setIsValid(true);
        } else {
            setIsValid(false);
        }
        setError(validationResult.errorMessage);
    };

    return {
        value,
        setValue,
        error,
        setError,
        isValid,
        setIsValid,
        handleChange,
        validate,
    };
};

export default useInputField;