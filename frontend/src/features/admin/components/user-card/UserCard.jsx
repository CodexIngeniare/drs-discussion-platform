import React from 'react';
import { TextInput } from '../../../../components/form';
import { VerticalLine } from '../../../../components/common';
import './UserCard.css';

function UserCard({ user }) {

    return (
        <div className='UserCard'>
            <div className='UserCard__title'>
                <h1>User Details</h1>
                <hr/>
            </div>
            <div className='UserCard__account-info-container'>
                <div className='UserCard__id-container'>
                    <TextInput
                        label="ID"
                        value={user?.id}
                        disabled={true}
                    />
                </div>
                <div>
                    <VerticalLine />
                </div>
                <div className='UserCard__account-info'>
                    <TextInput
                        label="Email"
                        value={user?.email}
                        disabled={true}
                    />
                    <TextInput
                        label="Username"
                        value={user?.username}
                        disabled={true}
                    />
                    <div className='UserCard__full-name-container'>
                        <TextInput
                            label="First Name"
                            value={user?.first_name}
                            disabled={true}
                        />
                        <TextInput
                            label="Last Name"
                            value={user?.last_name}
                            disabled={true}
                        />
                    </div>
                    <TextInput
                        label="Phone Number"
                        value={user?.phone_number}
                        disabled={true}
                    />
                    <TextInput
                        label="Country"
                        value={user?.country}
                        disabled={true}
                    />
                    <TextInput
                        label="City"
                        value={user?.city}
                        disabled={true}
                    />
                    <TextInput
                        label="Address"
                        value={user?.address}
                        disabled={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default UserCard;