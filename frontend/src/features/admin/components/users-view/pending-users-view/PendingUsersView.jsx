import { usePendingUsersWebSocket } from './hooks';
import { useState } from 'react';
import './PendingUsersView.css';

import { UserList } from '../components';
import { UserApprovalForm } from './components';

function PendingUsersView() {
    const { pendingUsers, removeUserFromPending } = usePendingUsersWebSocket("http://127.0.0.1:5000/admin");
    const [selectedUser, setSelectedUser] = useState(null);

    const removeSelectedUser = (userId) => {
      removeUserFromPending(userId);
      setSelectedUser(null);
    };
    return (
      <div className="PendingUsersView">
        <section className='PendingUsersView__user-list-section'>
          <UserList users={pendingUsers} setSelectedUser={setSelectedUser}/>
        </section>
        <section className='PendingUsersView__user-detail-section'>
          {selectedUser && <UserApprovalForm selectedUser={selectedUser} removeUserFromPending={removeSelectedUser} />}
        </section>
      </div>
    );
}

export default PendingUsersView;