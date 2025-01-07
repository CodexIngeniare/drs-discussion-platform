import { useEffect } from 'react';
import { DiscussionList } from './components';
import { useDiscussions } from '../../hooks';
import './FeedView.css';

function FeedView (){
    const { discussions, fetchDiscussions } = useDiscussions();

    useEffect(() => {
        fetchDiscussions();
    }, []);

    return (
        <div className="FeedView">
            <section className='FeedView__search-section'>
            </section>
            <section className='FeedView__discussions-section'>
                <DiscussionList discussions={discussions}/>
            </section>
        </div>
    );
};

export default FeedView;