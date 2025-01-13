import { useState, useEffect } from 'react';
import { SearchBox, DiscussionList } from './components';
import { NewButton } from '../buttons';
import { useDiscussions } from '../../hooks';
import './FeedView.css';

function FeedView (){
    const { discussions, fetchDiscussions } = useDiscussions();
    const [searchedDiscussions, setSearchedDiscussions] = useState([]);

    useEffect(() => {
        fetchDiscussions();
        
    }, []);
    useEffect(() => {
        setSearchedDiscussions(discussions);
    }, [discussions]);

    return (
        <div className="FeedView">
            <section className='FeedView__search-section'>
                <SearchBox setDiscussions={setSearchedDiscussions}/>
                <NewButton link="/dashboard/discussions/new"/>
            </section>
            <section className='FeedView__discussions-section'>
                <label className='FeedView__search-results'>Search Results - {searchedDiscussions.length}</label>
                <DiscussionList discussions={searchedDiscussions}/>
            </section>
        </div>
    );
};

export default FeedView;