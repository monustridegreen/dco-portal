import './App.css';
// import basePath from './shared/basepath';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Faultboundary from './components/error/FaultyComponent';
import Userdashboard from './pages/Dashboard/index';
import Login from './pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeadDetails from './pages/LeadDetails/index';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/engage" replace />} />
        <Route path="/engage/login" element={<Login />} />
        <Route path="/engage" element={<Userdashboard />} />
        <Route path="/engage/dashboard" element={<Userdashboard />} />
        <Route path="/engage/leadDetails" element={<LeadDetails />} />
        <Route path="/engage/faultboundary" element={<Faultboundary />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
