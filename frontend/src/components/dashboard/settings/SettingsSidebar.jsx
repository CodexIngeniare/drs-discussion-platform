import { useNavigate } from 'react-router-dom';
import '../../../styles/dashboard/SettingsSidebar.css';

function SettingsSidebar() {
    const navigate = useNavigate();

    const toAccountData = () => {
        navigate('/dashboard/settings/account');
    }
    const toPersonalData = () => {
        navigate('/dashboard/settings/personal');
    }

    return (
        <div className='SettingsSidebar'>
            <div className='sidebar-title'>
                <label>Settings</label>
                <hr></hr>
            </div>
            <div className='settings-links'>
                <div>
                    <button onClick={toAccountData}>Account</button>
                    <button onClick={toPersonalData}>Personal Info</button>
                    <hr></hr>
                </div>
            </div>
            <div>
                <button className='caution-btn'>Sign out</button>
            </div>
        </div>
    );
}

export default SettingsSidebar;