import React from 'react';
import { TopicListItem } from './components';
import './TopicList.css';

function TopicList({ topics = [], handleSelect }) {
    return (
        <div className='TopicList'>
            <div className='TopicList__list-container'>
                {topics.map((topic, index) => (
                    <TopicListItem topic={topic} handleSelect={handleSelect}/>
                ))}
            </div>
        </div>
    );
}

export default TopicList;