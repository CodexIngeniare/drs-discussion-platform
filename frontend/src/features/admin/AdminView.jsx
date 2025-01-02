import { Routes, Route, Navigate} from 'react-router-dom';
import { Sidebar } from '../../layouts'
import { NavLink } from '../../components'
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
        <main>
          <Routes>
            <Route index element={<Navigate to="pending-users" />} />
            <Route path="/pending-users/*" element={<label>Pending Users</label>}/>
            <Route path="/registered-users/*" element={<label>Registered Users</label>}/>
          </Routes>
        </main>
        <aside className='AdminView__right-sidebar-section'>User Display</aside>
      </div>
    );
}

export default AdminView;