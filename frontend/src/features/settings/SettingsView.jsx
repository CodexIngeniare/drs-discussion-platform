import { Routes, Route, Navigate} from 'react-router-dom';
import { Sidebar } from '../../layouts'
import { NavLink } from '../../components'
import { LogoutButton } from '../logout';
import { AccountSettings, PersonalInfo } from './components';
import './SettingsView.css';

function SettingsView() {

    return (
      <div className="SettingsView">
        <aside className='SettingsView__left-sidebar-section'>
          <Sidebar>
            <Sidebar.Top>
              <NavLink label="Account Settings" link="/dashboard/settings/account"/>
              <NavLink label="Personal Info" link="/dashboard/settings/personal"/>
              <hr/>
            </Sidebar.Top>
            <Sidebar.Bottom>
              <LogoutButton />
            </Sidebar.Bottom>
          </Sidebar>
        </aside>
        <main>
          <Routes>
            <Route index element={<Navigate to="account" />} />
            <Route path="/account/*" element={<AccountSettings/>}/>
            <Route path="/personal/*" element={<PersonalInfo/>}/>
          </Routes>
        </main>
        {/*<aside className='SettingsView__right-sidebar-section'>Aside</aside>*/}
      </div>
    );
}

export default SettingsView;