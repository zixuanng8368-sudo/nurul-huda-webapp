console.log("Check Env:", import.meta.env.VITE_SUPABASE_URL);

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import EventPage from './pages/EventPage';


function App() {

  // Login listener
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
  //Check active sessions
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  });


  //Listen for changes on auth state (login/logout)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => subscription.unsubscribe();
}, []);


// Inside your return/routes:



  return (
    <Router>
      <Navbar /> {/* Navbar stays visible on all pages */}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/admin" element={session ? <AdminPage /> : <Navigate to="/login" />}  />
        
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin/events" element={session ? <EventPage /> : <Navigate to="/login" />} /> 

        {/* This helps debug: */}
        <Route path="*" element={<div>Page Not Found</div>} />


      </Routes>
    </Router>
  );
}

export default App;