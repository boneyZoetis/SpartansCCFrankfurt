import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import PlayerRegistration from './pages/PlayerRegistration';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/join" element={<PlayerRegistration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
