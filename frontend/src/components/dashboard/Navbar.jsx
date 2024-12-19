import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard/Navbar.css';

function Navbar() {
    const navigate = useNavigate();

    const toAdminView = () => {
        navigate('/dashboard/admin');
    }
    const toDiscussionsView = () => {
        navigate('/dashboard/discussions');
    }
    const toSettingsView = () => {
        navigate('/dashboard/settings');
    }

    return (
        <div className="Navbar">
            <div className="view-btns">
                <button onClick={toAdminView}>Administration</button>
                <label>|</label>
                <button onClick={toDiscussionsView}>Discussions</button>
            </div>
            <div className='account-btns'>
                <button onClick={toSettingsView}>@Username</button>
            </div>
        </div>
    );
}

export default Navbar;