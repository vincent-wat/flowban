import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from './Components/User/Profile/EditUser';
import Home from './Components/General/Home';
import LoginPage from './Components/User/Login/LoginPage';
import KanbanBoard from './Components/Kanban/KanbanBoard';
import Layout from './Components/General/Layout';
import SignUpPage from './Components/User/Sign_Up/SignUpPage';
import Settings from './Components/User/Profile/Settings';
/* import Navbar from './Components/General/NavbarAlt'; */

function App() {
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile/settings" element={<Settings />} />
        </Routes>
      </Layout>
  );
}

export default App;


