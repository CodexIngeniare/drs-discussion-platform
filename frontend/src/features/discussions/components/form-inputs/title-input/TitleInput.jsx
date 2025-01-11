import { useState } from 'react';
import { validateTitle } from '../../../../../utils';
import './TitleInput.css';

function TitleInput ({ setTitle }){

    const handleChange = (e) => {
        setTitle(e.target.value);
    };
    return(
        <div className='TitleInput'>
            <textarea className='TitleInput__input'
                      onChange={handleChange}
                      rows={2}
                      spellCheck={false}
                      placeholder='enter title for discussion...'>
            </textarea>
        </div>
    );
};

export default TitleInput;