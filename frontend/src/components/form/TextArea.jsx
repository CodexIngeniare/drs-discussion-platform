import "./TextArea.css";

function TextArea ({ label, value, error, placeholder, rows, required=false, handleChange=()=>{}, disabled=false }){
    return (
        <div className="TextArea">
            <div className="TextArea__label-container">
                <label className="TextArea__name-label">{label}</label>
                {required && <label className="TextArea__required-label">*</label>}
            </div>
            <textarea className="TextArea__input"
                value={value}
                rows={rows}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                spellCheck={false}
                />
            {error && <span className='TextArea__error-message'>{error}</span>}
        </div>
    );
};

export default TextArea;