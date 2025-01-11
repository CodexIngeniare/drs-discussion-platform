import { useEffect } from 'react';
import { useTopics } from '../../../../admin/components/topics-view/hooks';
import './TopicInput.css';

function TopicInput ({ setTopicID }){
    const { topics, fetchTopics } = useTopics();

    useEffect(() => {
        fetchTopics();
    }, []);
    const handleChange = (e) => {
        setTopicID(e.target.value);
    };

    return (
        <div className='TopicInput'>
            <select className='TopicInput__select' onChange={handleChange} title='Select topic for discussion'>
                <option value={""}>Select topic</option>
                {topics.map((topic, index) => (
                    <option value={topic.id} title={topic.description}>
                        {topic.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TopicInput;