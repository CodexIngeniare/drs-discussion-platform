//import { useEffect } from 'react';
//import { useTopics } from './hooks';
import './TopicsView.css';

function TopicsView() {
  //const { topics, fetchTopics } = useTopics('http://localhost:5000/api/topics');

  /*useEffect(() => {
    fetchTopics();
  }, []);*/

  return (
    <div className="TopicsView">
      <section className='TopicsView__list-section'>
          <label>Discussion Topics List</label>
      </section>
      <section className='TopicsView__details-section'>
          <label>Topic Details</label>
      </section>
    </div>
  );
}

export default TopicsView;