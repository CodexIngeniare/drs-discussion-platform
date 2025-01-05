import { useState, useEffect } from 'react';
import { useRegisteredUsers } from './hooks';
import './RegisteredUsersView.css';

import { UserList, UserCard } from '../components';

function RegisteredUsersView() {
  const { registeredUsers, fetchRegisteredUsers } = useRegisteredUsers("http://127.0.0.1:5000/registered_users");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchRegisteredUsers();
  }, []);

  return (
    <div className="RegisteredUsersView">
      <section className='RegisteredUsersView__user-list-section'>
          <UserList users={registeredUsers} setSelectedUser={setSelectedUser}/>
      </section>
      <section className='RegisteredUsersView__user-details-section'>
      {selectedUser && <UserCard user={selectedUser}/>}
      </section>
    </div>
  );
}

export default RegisteredUsersView;