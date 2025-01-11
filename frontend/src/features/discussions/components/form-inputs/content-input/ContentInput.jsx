import './ContentInput.css';

function ContentInput ({ setContent }){
    const handleChange = (e) => {
        setContent(e.target.value);
    };
    return (
        <div className='ContentInput'>
            <textarea className='ContentInput__input'
                      onChange={handleChange}
                      spellCheck={false}
                      placeholder='enter content for discussion...'>
            </textarea>
        </div>
    );
};

export default ContentInput;