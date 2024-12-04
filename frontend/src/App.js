import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Profile from "./Components/User/Profile/EditUser";
import Home from "./Components/General/Home";
import LoginPage from "./Components/User/Login/LoginPage";
import KanbanBoard from "./Components/Kanban/KanbanBoard";
import Layout from "./Components/General/Layout";
import SignUpPage from "./Components/User/Sign_Up/SignUpPage";
import Settings from "./Components/User/Profile/Settings";
import Dashboard from "./Components/Kanban/Dashboard";
import DashboardLayout from "./Components/Kanban/DashboardLayout"; // Import DashboardLayout
import ForgotPassword from "./Components/User/Passwords/ForgotPassword";
import ResetPassword from "./Components/User/Passwords/ResetPassword";
import ErrorPage from "./Components/General/ErrorPage";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <>
      {isDashboard ? (
        <DashboardLayout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </DashboardLayout>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile/settings" element={<Settings />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default App;
