import '../../../styles/dashboard/PersonalInfoSettings.css'

function PersonalInfoSettings() {
  return (
    <div className='PersonalInfoSettings'>
        <div className='settings-title'>
            <label>Personal Info</label>
            <hr />
        </div>
        <div className='input-field'>
            <label>First Name</label>
            <input type='text'></input>
        </div>
        <div className='input-field'>
            <label>Last Name</label>
            <input type='text'></input>
        </div>
        <div className='input-field'>
            <label>Phone Number</label>
            <input type='text'></input>
        </div>
        <div>
            <hr />
        </div>
        <div className='input-field'>
            <label>Country</label>
            <input type='text'></input>
        </div>
        <div className='input-field'>
            <label>City</label>
            <input type='text'></input>
        </div>
        <div className='input-field'>
            <label>Address</label>
            <input type='text'></input>
        </div>
    </div>
  );
}

export default PersonalInfoSettings;