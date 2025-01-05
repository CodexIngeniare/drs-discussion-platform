import { useEffect, useState } from 'react';
import { useTopics } from './hooks';
import { TopicList } from './components';
import { NewTopicForm, EditTopicForm } from './components';
import './TopicsView.css';

function TopicsView() {
  const { topics, fetchTopics } = useTopics();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);
  const createNewTopic = () => {
    setSelectedTopic(null);
    setIsCreatingNew(true);
  };
  const cancel = () => {
    setSelectedTopic(null);
    setIsCreatingNew(false);
    fetchTopics();
  };

  return (
    <div className="TopicsView">
      <section className='TopicsView__list-section'>
          <div className='TopicsView__list-header'>
            <h1 className='TopicsView__list-title'>Discussion Topics</h1>
            <button className='TopicsView__new-topic-button' onClick={createNewTopic}>New Topic</button>
          </div>
          <hr/>
          <TopicList topics={topics} handleSelect={setSelectedTopic}/>
      </section>
      <section className='TopicsView__details-section'>
        { selectedTopic && <EditTopicForm selectedTopic={selectedTopic} cancel={cancel}/>}
        { (isCreatingNew && !selectedTopic) && <NewTopicForm cancel={cancel}/>}
      </section>
    </div>
  );
}

export default TopicsView;