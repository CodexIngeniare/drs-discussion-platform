import { DiscussionListItem } from './components';
import './DiscussionList.css';

function DiscussionList ({ discussions=[] }) {
    return (
        <div>
            {discussions.map((discussion, index) => (
                <div>
                    <DiscussionListItem discussion={discussion}/>
                </div>
            ))}
        </div>
    );
};

export default DiscussionList;