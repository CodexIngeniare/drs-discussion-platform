import '../../../styles/dashboard/AccountSettings.css';

function AccountSettings() {
  return (
    <div className='AccountSettings'>
        <div className='settings-title'>
            <label>Account Settings</label>
            <hr />
        </div>
        <div className='input-field'>
            <label>Email</label>
            <input type='text'></input>
        </div>
        <div className='input-field'>
            <label>Username</label>
            <input type='text'></input>
        </div>
        <div>
            <hr />
        </div>
        <div className='input-field'>
            <label>Password</label>
            <input type='password'></input>
        </div>
        <div className='input-field'>
            <label>New Password</label>
            <input type='password'></input>
        </div>
        <div className='input-field'>
            <label>Confirm</label>
            <input type='password'></input>
        </div>
    </div>
  );
}

export default AccountSettings;
