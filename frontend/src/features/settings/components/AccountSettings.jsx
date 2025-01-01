import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context';
import { TextInput, PasswordInput } from "../../../components";
import { useInputField } from "../../../hooks";
import { validateEmail, validateUsername, validateLoginPassword, validateRegisterPassword } from "../../../utils/input-validations";
import { useUpdateUserData } from './hooks';
import { useFetchAccountData } from '../../../hooks';
import './AccountSettings.css';

function AccountSettings() {
    const { email, username, loadContextFromSession } = useContext(AuthContext);
    const emailField = useInputField(email, true, validateEmail, true);
    const [isEmailModified, setIsEmailModified] = useState(false);
    const usernameField = useInputField(username, true, validateUsername, true);
    const [isUsernameModified, setIsUsernameModified] = useState(false);
    const oldPasswordField = useInputField('', false, validateLoginPassword, true);
    const newPasswordField = useInputField('', false, validateRegisterPassword, true);

    const { isUpdating, updateErrors, updateAccount, updatePassword } = useUpdateUserData("http://127.0.0.1:5000/update_user_data");
    const { fetchAccountData } = useFetchAccountData("http://127.0.0.1:5000/user_data");

    useEffect(() => {
        emailField.setError(updateErrors.email);
        usernameField.setError(updateErrors.username);
        oldPasswordField.setError(updateErrors.oldPassword);
    }, [updateErrors]);
    useEffect(() => {
        if(emailField.value !== email && emailField.isValid){
            setIsEmailModified(true);
        } else{
            setIsEmailModified(false);
        }
    }, [emailField.value]);
    useEffect(() => {
        if(usernameField.value !== username && usernameField.isValid){
            setIsUsernameModified(true);
        } else{
            setIsUsernameModified(false);
        }
    }, [usernameField.value]);
    const validateEmailAndUsername = () => {
        let valid = true;

        emailField.validate();
        usernameField.validate();

        if(!emailField.isValid){
            valid = false;
        }
        if(!usernameField.isValid){
            valid = false;
        }
        if(emailField.value === email && usernameField.value === username){
            valid = false;
        }
        return valid;
    };
    const validatePasswords = () => {
        let valid = true;

        oldPasswordField.validate();
        newPasswordField.validate();

        if(!oldPasswordField.isValid){
            valid = false;
        }
        if(!newPasswordField.isValid){
            valid = false;
        }
        if(oldPasswordField.value === newPasswordField.value && newPasswordField.value !== ''){
            valid = false;
            newPasswordField.setError("New password must be different from the current password.");
        }
        return valid;
    };
    const changeEmailAndUsername = async () => {
        if(isUpdating){
            return;
        }
        if(!validateEmailAndUsername()){
            return;
        }
        if(await updateAccount(emailField.value, usernameField.value)){
            const token = sessionStorage.getItem("token");
            if(await fetchAccountData(token)){
                loadContextFromSession();
                setIsEmailModified(false);
                setIsUsernameModified(false);
            }
        }
    };
    const changePassword = async () => {
        if(isUpdating){
            return;
        }
        if(!validatePasswords()){
            return;
        }
        if(await updatePassword(oldPasswordField.value, newPasswordField.value)){
            const token = sessionStorage.getItem("token");
            if(await fetchAccountData(token)){
                loadContextFromSession();
                oldPasswordField.setValue('');
                newPasswordField.setValue('');
            }
        }
    };

    return (
      <div className="AccountSettings">
        <div>
            <h1 className='AccountSettings__title'>Account Settings</h1>
            <hr/>
        </div>
        <div className='AccountSettings__field-container'>
            <TextInput
                label="Email"
                value={emailField.value}
                handleChange={emailField.handleChange}
                error={emailField.error}
                placeholder="enter your email address"
                required={emailField.error}
            />
            { isEmailModified && <span className='AccountSettings__modified-message'>Modified</span>}
        </div>
        <div className='AccountSettings__field-container'>
            <TextInput
                label="Username"
                value={usernameField.value}
                handleChange={usernameField.handleChange}
                error={usernameField.error}
                placeholder="enter your username"
                required={usernameField.error}
            />
            { isUsernameModified && <span className='AccountSettings__modified-message'>Modified</span>}
        </div>
        <button className='AccountSettings__change-button' onClick={changeEmailAndUsername}>Update</button>
        <div className='AccountSettings__change-password-title'>
            <h2>Change Password</h2>
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
        <button className='AccountSettings__change-button' onClick={changePassword}>Update</button>
      </div>
    );
}

export default AccountSettings;