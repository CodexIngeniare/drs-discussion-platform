import React from 'react';
import { TextInput, VerticalLine } from '../../../../../../../components';
import './UserListItem.css';

function UserListItem({ user, onClick }) {
    
    const handleOnClick = () => {
        onClick(user);
    }

    return (
        <div className='UserListItem' onClick={handleOnClick}>
            <div className='UserListItem__id-container'>
                <TextInput label="ID" value={user.id} disabled={true} placeholder="no ID"/>
            </div>
            <div>
                <VerticalLine />
            </div>
            <div className='UserListItem__info-container'>
                <TextInput label="Email" value={user.email} disabled={true}/>
                <TextInput label="Username" value={user.username} disabled={true}/>
            </div>
        </div>
    );
}

export default UserListItem;