import { useState } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import { Sidebar } from '../../layouts'
import { NavLink } from '../../components'
import { usePendingUsersWebSocket } from './hooks';
import './AdminView.css';

import { UserList } from './components';
import { UserApprovalForm } from './components'

function AdminView() {
    const { pendingUsers, removeUserFromPending } = usePendingUsersWebSocket("http://127.0.0.1:5000/admin");
    const [selectedUser, setSelectedUser] = useState(null);

    const removeSelectedUser = (userId) => {
      removeUserFromPending(userId);
      setSelectedUser(null);
    };
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
        <main className='AdminView__user-list-section'>
          <Routes>
            <Route index element={<Navigate to="pending-users" />} />
            <Route path="/pending-users/*" element={<UserList users={pendingUsers} setSelectedUser={setSelectedUser}/>}/>
            <Route path="/registered-users/*" element={<label>Registered Users</label>}/>
          </Routes>
        </main>
        <aside className='AdminView__user-detail-section'>
          <Routes>
            <Route path="/pending-users/*" element={
              selectedUser && <UserApprovalForm selectedUser={selectedUser} removeUserFromPending={removeSelectedUser} />
            }/>
            <Route path="/registered-users/*" element={<label>Selected Registered User</label>}/>
          </Routes>
        </aside>
      </div>
    );
}

export default AdminView;