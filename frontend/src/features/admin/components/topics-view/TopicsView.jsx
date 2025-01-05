import { useEffect, useState } from 'react';
import { useTopics } from './hooks';
import { TopicList } from './components';
import './TopicsView.css';

function TopicsView() {
  const { topics, fetchTopics } = useTopics('http://localhost:5000/get_all_topics');
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className="TopicsView">
      <section className='TopicsView__list-section'>
          <div className='TopicsView__list-header'>
            <h1 className='TopicsView__list-title'>Discussion Topics</h1>
            <button className='TopicsView__new-topic-button'>New Topic</button>
          </div>
          <hr/>
          <TopicList topics={topics} handleSelect={setSelectedTopic}/>
      </section>
      <section className='TopicsView__details-section'>
        { selectedTopic && <label>{selectedTopic.name}</label>}
      </section>
    </div>
  );
}

export default TopicsView;