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
            <DiscussionList discussions={discussions}/>
        </div>
    );
};

export default FeedView;