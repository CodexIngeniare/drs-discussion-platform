import { TextInput, VerticalLine } from '../../../../../../../components';
import './TopicListItem.css'

function TopicListItem ( { topic }) {
    return (
        <div className="TopicListItem">
            <div className='TopicListItem__credentials-container'>
                <div className='TopicListItem__id-container'>
                    <TextInput
                        label="ID"
                        value={topic.id}
                        disabled={true}
                    />
                </div>
                <div>
                    <VerticalLine/>
                </div>
                <TextInput
                    label="Topic Name"
                    value={topic.name}
                    disabled={true}
                />
            </div>
        </div>
    );
};

export default TopicListItem;