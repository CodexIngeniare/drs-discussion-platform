import { useEffect } from 'react';
import { useTopics } from '../../../../../../../admin/components/topics-view/hooks';
import './FilterTopic.css';

function FilterTopic({ setTopicID = () => {}, value = ""}){
    const { topics, fetchTopics } = useTopics();

    useEffect(() => {
        fetchTopics();
    }, []);
    const handleChange = (e) => {
        setTopicID(e.target.value);
    };

    return (
        <div className='FilterTopic'>
            <select className='FilterTopic__select' value={value} onChange={handleChange} title='Search for topic'>
                <option value={""}>Filter by topic</option>
                {topics.map((topic, index) => (
                    <option value={topic.id} title={topic.description}>
                        {topic.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterTopic;