import { Routes, Route, Navigate} from 'react-router-dom';
import { SettingsView } from '../features/settings';
import { Navbar } from '../layouts';
import "./DashboardPage.css";

function DashboardPage() {
  return (
    <div className="DashboardPage">
        <header className="header-section">
          <Navbar />
        </header>
        <main className="main-section">
          <Routes>
            <Route index element={<Navigate to="discussions" />} />
            <Route path="/admin/*" element={<label>ADMINISTRATION VIEW</label>}/>
            <Route path="/settings/*" element={<SettingsView />}/>
            <Route path="/discussions/*" element={<label>DISCUSSIONS VIEW</label>}/>
          </Routes>
        </main>
        {/*<footer className="footer-section">Footer</footer>*/}
    </div>
  );
}

export default DashboardPage;