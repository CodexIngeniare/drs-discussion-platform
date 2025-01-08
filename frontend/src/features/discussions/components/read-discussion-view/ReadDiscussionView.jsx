import { ReadDiscussionForm } from './components';
import { BackButton, EditButton, DeleteButton } from '../buttons';
import './ReadDiscussionView.css';

function ReadDiscussionView () {
    return (
        <div className='ReadDiscussionView'>
            <section className='ReadDiscussionView__discussion-section'>
                <div className='ReadDiscussionView__buttons'>
                    <div>
                        <BackButton link="/dashboard/discussions/feed"/>
                    </div>
                    <div className='ReadDiscussionView__option-buttons'>
                        <EditButton link="/dashboard/discussions/feed"/>
                        <DeleteButton link="/dashboard/discussions/feed"/>
                    </div>
                </div>
                <ReadDiscussionForm/>
            </section>
            <section className='ReadDiscussionView__comments-section'>
            </section>
        </div>
    );
};

export default ReadDiscussionView;
