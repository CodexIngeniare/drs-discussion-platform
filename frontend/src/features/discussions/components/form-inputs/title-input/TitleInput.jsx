import './TitleInput.css';

function TitleInput ({ setTitle, initValue = "" }){

    const handleChange = (e) => {
        setTitle(e.target.value);
    };
    return(
        <div className='TitleInput'>
            <textarea className='TitleInput__input'
                      onChange={handleChange}
                      rows={2}
                      value={initValue}
                      spellCheck={false}
                      placeholder='enter title for discussion...'>
            </textarea>
        </div>
    );
};

export default TitleInput;