import React from 'react';
import { TextInput } from '../../../../../../components/form';
import { VerticalLine } from '../../../../../../components/common';
import './UserCard.css';

import { useEffect } from 'react';

function UserCard({ user }) {

    useEffect(() => {
        console.log(user);
      }, [user]);

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
                        placeholder='no ID'
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
                        placeholder='no phone number provided'
                    />
                    <TextInput
                        label="Country"
                        value={user?.country}
                        disabled={true}
                        placeholder='no country provided'
                    />
                    <TextInput
                        label="City"
                        value={user?.city}
                        disabled={true}
                        placeholder='no city provided'
                    />
                    <TextInput
                        label="Address"
                        value={user?.address}
                        disabled={true}
                        placeholder='no address provided'
                    />
                </div>
            </div>
        </div>
    );
}

export default UserCard;