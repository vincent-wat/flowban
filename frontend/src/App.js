import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './Components/User/Profile/EditUser';
import Home from './Components/General/Home';
import LoginPage from './Components/User/Login/LoginPage';
import KanbanBoard from './Components/Kanban/KanbanBoard';
import Layout from './Components/General/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/kanban" element={<KanbanBoard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


