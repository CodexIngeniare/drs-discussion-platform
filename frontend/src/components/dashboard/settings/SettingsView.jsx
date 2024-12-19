import { Routes, Route, Navigate} from 'react-router-dom';
import SettingsSidebar from './SettingsSidebar.jsx';
import AccountSettings from './AccountSettings.jsx';
import '../../../styles/dashboard/SettingsView.css';

function SettingsView() {
  return (
    <div className='SettingsView'>
        <aside className='settings-sidebar-section'>
            <SettingsSidebar />
        </aside>
        <main className='settings-main-section'>
            <Routes>
                <Route index element={<Navigate to="account" />} />
                <Route path="/account/*" element={<AccountSettings />}/>
                <Route path="/personal/*" element={<label>PERSONAL</label>}/>
          </Routes>
        </main>
        <div className='settings-free-section'></div>
    </div>
  );
}

export default SettingsView;
