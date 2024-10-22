import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './Components/Profile/EditUser'; 
import LoginPage from './Components/Login/LoginPage'; 

function App() {
  return (
    <Router>
        <Routes>
          {/* Define routes for different pages */}
          <Route path="/" /> {/* create home page later */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
    </Router>
  );
}

export default App;

