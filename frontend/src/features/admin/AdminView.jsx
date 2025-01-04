import { Routes, Route, Navigate} from 'react-router-dom';
import { Sidebar } from '../../layouts';
import { NavLink } from '../../components';
import { PendingUsersView, RegisteredUsersView } from './components';
import './AdminView.css';

function AdminView() {
    return (
      <div className="AdminView">
        <aside className='AdminView__left-sidebar-section'>
          <Sidebar>
            <Sidebar.Top>
              <NavLink label="Pending Users" link="/dashboard/admin/pending-users"/>
              <NavLink label="Registered Users" link="/dashboard/admin/registered-users"/>
              <hr/>
            </Sidebar.Top>
          </Sidebar>
        </aside>
        <main className='AdminView__main-section'>
          <Routes>
            <Route index element={<Navigate to="pending-users"/>} />
            <Route path="/pending-users/*" element={<PendingUsersView/>}/>
            <Route path="/registered-users/*" element={<RegisteredUsersView/>}/>
          </Routes>
        </main>
      </div>
    );
}

export default AdminView;