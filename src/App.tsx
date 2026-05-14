/*Testing debug*/
console.log('APP URL:', import.meta.env.VITE_APP_URL)
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AdminPage from './pages/admin/AdminPage';
import LoginPage from './pages/authentication/LoginPage';
import SignUpPage from './pages/authentication/SignUpPage';
import EventsPage from './pages/EventsPage';
import FinancePage from './pages/FinancePage';
import { useSession } from './lib/auth-client';
import AdminEventPage from './pages/admin/AdminEventPage';

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
        <Route path="/admin" element={session.user ? <AdminPage /> : <Navigate to="/login" />} />
        <Route path="/admin/events" element={session.user ? <AdminEventPage /> : <Navigate to ="/login" />} />
        <Route path="/admin/finance" element={session.user ? <FinancePage /> : <Navigate to ="/login" />} />
        <Route path="/login" element={!session.user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!session.user ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="*" element={<div className="p-4">Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;