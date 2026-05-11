console.log("Check Env:", import.meta.env.VITE_SUPABASE_URL);

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar stays visible on all pages */}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nurul-huda" element={<HomePage />} />
        {/* This helps debug: */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;