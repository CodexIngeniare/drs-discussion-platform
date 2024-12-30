
function TextInput ({ label, value, error, placeholder, handleChange }) {
    return (
      <div className="TextInput">
          <div>
              <label>{label}</label>
          </div>
          <input
              type='text'
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
          />
          {error && <span className='error-message'>{error}</span>}
      </div>
    );
}

export default TextInput;