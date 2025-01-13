import './ContentInput.css';

function ContentInput ({ setContent, initValue = "" }){
    const handleChange = (e) => {
        setContent(e.target.value);
    };
    return (
        <div className='ContentInput'>
            <textarea className='ContentInput__input'
                      onChange={handleChange}
                      spellCheck={false}
                      value={initValue}
                      placeholder='enter content for discussion...'>
            </textarea>
        </div>
    );
};

export default ContentInput;