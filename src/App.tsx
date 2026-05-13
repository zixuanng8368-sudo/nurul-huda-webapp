/*Testing debug*/
console.log('APP URL:', import.meta.env.VITE_APP_URL)

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/authentication/LoginPage';
import SignUpPage from './pages/authentication/SignUpPage';
import FinancePage from './pages/FinancePage';
import { useSession } from './lib/auth-client';
import EventPage from './pages/EventPage';

function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={session ? <AdminPage /> : <Navigate to="/login" />} />
        <Route path="/admin/events" element={session ? <EventPage /> : <Navigate to ="/login" />} />
        <Route path="/admin/finance" element={session ? <FinancePage /> : <Navigate to ="/login" />} />
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="*" element={<div className="p-4">Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;