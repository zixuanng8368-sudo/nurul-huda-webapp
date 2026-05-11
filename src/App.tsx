console.log("Check Env:", import.meta.env.VITE_SUPABASE_URL);

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar stays visible on all pages */}
      
      <Routes>
        {/* URL: localhost:3000/ */}        
        <Route path="/nurul-huda" element={<HomePage />} />

      </Routes>
    </Router>
  );
}

export default App;