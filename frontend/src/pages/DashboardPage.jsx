import { Routes, Route, Navigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/dashboard/DashboardPage.css';

function DashboardPage() {

  return (
    <div className="DashboardPage">
        <header className="header-section">
          <Navbar />
        </header>
        <main className="main-section">
          <Routes>
            <Route index element={<Navigate to="admin" />} />
            <Route path="/admin/*" element={<label>ADMINISTRATION VIEW</label>}/>
            <Route path="/settings/*" element={<label>SETTINGS VIEW</label>}/>
            <Route path="/discussions/*" element={<label>DISCUSSIONS VIEW</label>}/>
          </Routes>
        </main>
        <footer className="footer-section">Footer</footer>
    </div>
  );
}

export default DashboardPage;