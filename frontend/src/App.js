import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './Components/Profile/EditUser'; 
import LoginPage from './Components/Login/LoginPage'; 
import KanbanBoard from './Components/Kanban/KanbanBoard';
//import Home from './Home'; 

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Flowban</h1>
        
        <Routes>
          {/* Define routes for different pages */}
          <Route path="/" /> {/* create home page later */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/kanban" element={<KanbanBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

