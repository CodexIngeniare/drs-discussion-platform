import { useContext } from 'react';
import { AuthContext } from '../../../context';
import { TextInput, PasswordInput } from "../../../components";
import { useInputField } from "../../../hooks";
import { validateEmail, validateUsername } from "../../../utils/input-validations";
import './AccountSettings.css';

function AccountSettings() {
    const { email, username } = useContext(AuthContext);
    const emailField = useInputField(email, true, validateEmail, true);
    const usernameField = useInputField(username, true, validateUsername, true);
    const oldPasswordField = useInputField('', false);
    const newPasswordField = useInputField('', false);

    return (
      <div className="AccountSettings">
        <div>
            <h1 className='AccountSettings__title'>Account Settings</h1>
            <hr/>
        </div>
        <TextInput
            label="Email"
            value={emailField.value}
            handleChange={emailField.handleChange}
            error={emailField.error}
            placeholder="enter your email address"
        />
        <TextInput
            label="Username"
            value={usernameField.value}
            handleChange={usernameField.handleChange}
            error={usernameField.error}
            placeholder="enter your username"
        />
        <div className='AccountSettings__change-password-title'>
            <h3>Change Password</h3>
            <hr/>
        </div>
        <PasswordInput
            label='Current password'
            value={oldPasswordField.value}
            handleChange={oldPasswordField.handleChange}
            error={oldPasswordField.error}
            placeholder='enter your current password'
        />
        <PasswordInput
            label='New password'
            value={newPasswordField.value}
            handleChange={newPasswordField.handleChange}
            error={newPasswordField.error}
            placeholder='enter your new password'
        />
      </div>
    );
}

export default AccountSettings;