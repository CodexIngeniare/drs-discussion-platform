import React, { useState } from 'react';

function TextInput ({ label, value, setValue, validateInput }) {
    const [localError, setLocalError] = useState("");

    const handleChange = (e) => {
        setValue(e.target.value);    
    };
    const handleValidation = () => {
        const newError = validateInput(value);
        if (!newError) {
        }
        setLocalError(newError);
        console.log("newError: ", newError);
    };

    return (
      <div className="TextInput">
          <div>
              <label>{label}</label>
          </div>
          <input
              type='text'
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleValidation}
          />
          {localError && <span className='error-message'>{localError}</span>}
      </div>
    );
}

export default TextInput;