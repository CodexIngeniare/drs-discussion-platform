import { Routes, Route, Navigate} from 'react-router-dom';
import { Sidebar } from '../../layouts';
import { NavLink } from '../../components';
import { FeedView } from './components';
import './DiscussionsView.css';

function DiscussionsView () {

    return (
        <div className='DiscussionsView'>
            <aside className='DiscussionsView__left-sidebar-section'>
            <Sidebar>
                <Sidebar.Top>
                    <NavLink label="Discussion Feed" link="/dashboard/discussions/feed"/>
                    <NavLink label="New Discussion" link="/dashboard/discussions/new"/>
                    <hr/>
                </Sidebar.Top>
            </Sidebar>
            </aside>
            <section className='DiscussionsView__main-section'>
                <Routes>
                    <Route index element={<Navigate to="feed"/>} />
                    <Route path="/feed/*" element={<FeedView/>}/>
                    <Route path="/new/*" element={<label>New Discussion</label>}/>
                </Routes>
            </section>
        </div>
    );
}

export default DiscussionsView;