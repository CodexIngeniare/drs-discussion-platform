import { DiscussionListItem } from './components';
import './DiscussionList.css';

function DiscussionList ({ discussions=[] }) {
    return (
        <div className='DiscussionList'>
            {discussions.map((discussion, index) => (
                <DiscussionListItem discussion={discussion}/>
            ))}
        </div>
    );
};

export default DiscussionList;