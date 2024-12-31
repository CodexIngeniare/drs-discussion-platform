import './TextInput.css';

function TextInput ({ label, value, error, placeholder, handleChange }) {
    return (
      <div className="TextInput">
          <div className="TextInput__label-container">
            <label className="TextInput__label">
                {label}
            </label>
          </div>
          <input className="TextInput__input"
              type='text'
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
          />
          {error && <span className='TextInput__error-message'>{error}</span>}
      </div>
    );
}

export default TextInput;