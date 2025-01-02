import React from 'react';
import { UserCard } from '../../components/user-card';
import './UserApprovalForm.css';

import { useRegistrationApproval } from './hooks';

function UserApprovalForm({ selectedUser, removeUserFromPending }) {
    const { approveUser, disapproveUser } = useRegistrationApproval('http://127.0.0.1:5000/approve_user', 'http://127.0.0.1:5000/disapprove_user');

    const handleApprove = async () => {
        if(!selectedUser){
            return;
        }
        if(await approveUser(selectedUser.id)){
            removeUserFromPending(selectedUser.id);
            selectedUser = null;
        }
    };
    const handleDisapprove = async () => {
        if(!selectedUser){
            return;
        }
        if(await disapproveUser(selectedUser.id)){
            removeUserFromPending(selectedUser.id);
            selectedUser = null;
        }
    };

    return (
        <div className="UserApprovalForm">
            <UserCard user={selectedUser} />
            <div className='UserApprovalForm__actions'>
                <button className='UserApprovalForm__reject-button' onClick={handleDisapprove}>Disapprove</button>
                <button className='UserApprovalForm__approve-button' onClick={handleApprove}>Approve</button>
            </div>
        </div>
    );
}

export default UserApprovalForm;