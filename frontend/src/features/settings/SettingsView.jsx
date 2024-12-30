import { Routes, Route, Navigate} from 'react-router-dom';
import { Sidebar } from '../../layouts'
import { NavLink } from '../../components'
import { LogoutButton } from '../logout';
import './SettingsView.css';

function SettingsView() {

    return (
      <div className="SettingsView">
        <aside className='left-sidebar-section'>
          <Sidebar>
            <Sidebar.Top>
              <NavLink label="Account Settings" link="/dashboard/settings/account"/>
              <NavLink label="Personal Settings" link="/dashboard/settings/personal"/>
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
            <Route path="/account/*" element={<label>ACCOUNT INFO</label>}/>
            <Route path="/personal/*" element={<label>PERSONAL INFO</label>}/>
          </Routes>
        </main>
        <aside className='right-sidebar-section'>Aside</aside>
      </div>
    );
}

export default SettingsView;