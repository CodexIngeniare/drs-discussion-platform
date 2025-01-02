import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Routes, Route, Navigate} from 'react-router-dom';
import { SettingsView } from '../features/settings';
import { AdminView } from '../features/admin';
import { Navbar } from '../layouts';
import { NavLink } from '../components/ui';
import "./DashboardPage.css";

function DashboardPage() {
  const { userRole, username } = useContext(AuthContext);
  
  return (
    <div className="DashboardPage">
        <header className="DashboardPage__header-section">
          <Navbar>
            <Navbar.Left>
              {userRole === 'admin' && <NavLink label="Administration" link="/dashboard/admin"/>}
              <NavLink label="Discussions" link="/dashboard/discussions"/>
            </Navbar.Left>
            <Navbar.Right>
              <NavLink label={`@${username}`} link="/dashboard/settings"/>
            </Navbar.Right>
          </Navbar>
        </header>
        <main className="DashboardPage__main-section">
          <Routes>
            <Route index element={<Navigate to="discussions" />} />
            <Route path="/admin/*" element={<AdminView />}/>
            <Route path="/settings/*" element={<SettingsView />}/>
            <Route path="/discussions/*" element={<label>DISCUSSIONS VIEW</label>}/>
          </Routes>
        </main>
        {/*<footer className="DashboardPage__footer-section">Footer</footer>*/}
    </div>
  );
}

export default DashboardPage;