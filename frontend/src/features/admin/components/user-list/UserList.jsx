import React from 'react';
import { UserListItem } from './components';
import './UserList.css';

function UserList({ users, setSelectedUser }) {
    return (
        <div className='UserList'>
            {users.map((user, index) => (
                <UserListItem user={user} onClick={setSelectedUser}/>
            ))}
        </div>
    );
}

export default UserList;