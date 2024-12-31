import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './pages';
import { RegisterPage } from './pages';
import { DashboardPage } from './pages';

function App() {
  return (
    <div className='app-container'>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/dashboard/*' element={<DashboardPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
