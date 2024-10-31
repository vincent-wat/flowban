import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './Components/User/Profile/EditUser';
import Home from './Components/General/home';
import LoginPage from './Components/User/Login/LoginPage';
import KanbanBoard from './Components/Kanban/KanbanBoard';
import Layout from './Components/General/Layout';
import Navbar from './Components/General/NavbarAlt';
import SignUpPage from './Components/User/Sign_Up/SignUpPage';
import Settings from './Components/User/Profile/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


