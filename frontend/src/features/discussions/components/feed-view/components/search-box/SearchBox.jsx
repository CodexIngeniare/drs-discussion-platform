import { useState, useEffect } from 'react';
import { useDiscussions } from '../../../../hooks';
import { FilterTopic, SearchBar } from './components';
import './SearchBox.css';

function SearchBox({ setDiscussions = () => {}}){
    const {discussions, searchDiscussions } = useDiscussions();
    const [topicID, setTopicID] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        setDiscussions(discussions);
    }, [discussions]);
    const validateInput = () => {
        let isValid = true;

        return isValid
    }
    const handleSearch = async () => {
        if(!validateInput()){
            return;
        }
        if(await searchDiscussions(topicID, username, email, title)){
        }
    }

    return (
        <div className='SearchBox'>
            <FilterTopic setTopicID={setTopicID} value={topicID}/>
            <SearchBar setUsername={setUsername} setEmail={setEmail} setTitle={setTitle} onSearch={handleSearch}/>
        </div>
    );
};

export default SearchBox;