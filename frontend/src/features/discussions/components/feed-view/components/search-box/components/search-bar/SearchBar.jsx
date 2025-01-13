import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';

function SearchBar ({ setUsername, setEmail, setTitle, onSearch = () => {}}){

    const parseSearchInput = (input) => {
        let username = "";
        let email = "";
        let titleParts = [];
    
        const parts = input.trim().split(/\s+/);
    
        parts.forEach((part) => {
            if (!username && part.startsWith("@")) {
                username = part.slice(1);
            } else if (!email && /\S+@\S+\.\S+/.test(part)) {
                email = part;
            } else {
                titleParts.push(part);
            }
        });
    
        const title = titleParts.join(" "); // Reconstruct title from its parts
    
        return { username, email, title };
    };
    const handleChange = (value) => {
        const {username, email, title} = parseSearchInput(value);

        setUsername(username);
        setEmail(email);
        setTitle(title);
    };
    const handleSearch = () => {
        onSearch();
    };

    return (
        <div className='SearchBar'>
            <input
                className='SearchBar__input'
                type='text'
                onChange={(e) => {handleChange(e.target.value)}}
                placeholder='search by @username, email@example.com, or title'
            />
            <button className='SearchBar__button' onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch}/>
            </button>
        </div>
    )
};

export default SearchBar;