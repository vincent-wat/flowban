import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Profile from "./Components/User/Profile/EditUser";
import Home from "./Components/General/Home";
import LoginPage from "./Components/User/Login/LoginPage";
import KanbanBoard from "./Components/Kanban/KanbanBoard";
import Layout from "./Components/General/Layout";
import SignUpPage from "./Components/User/Sign_Up/SignUpPage";
import Settings from "./Components/User/Profile/Settings";
import UserOrganization from "./Components/User/Profile/UserOrganization";
import Dashboard from "./Components/Kanban/Dashboard";
import DashboardLayout from "./Components/Kanban/DashboardLayout"; // Import DashboardLayout
import ForgotPassword from "./Components/User/Passwords/ForgotPassword";
import ResetPassword from "./Components/User/Passwords/ResetPassword";
import ErrorPage from "./Components/General/ErrorPage";
import WorkflowBoard from "./Components/Forms/WorkflowBoardPage";
import ViewFormPage from "./Components/Forms/ViewFormPage";
import ProtectedRoute from './Components/Auth/ProtectedRoutes';
import OrganizationInvitePopup from './Components/Popups/OrganizationInvitePopup';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <>
      {isDashboard ? (
        <DashboardLayout>
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path ="/dashboard" element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            } />
          </Routes>
        </DashboardLayout>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path ="/profile" element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/kanban/:board_id" element={<KanbanBoard />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile/settings" element={<Settings />} />
            <Route path="/profile/organization" element={<UserOrganization />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/workflowBoard/:templateId" element={<WorkflowBoard />} />
            <Route path="/form/:templateId" element={<ViewFormPage />} />
            <Route path="/org-invite" element={<OrganizationInvitePopup />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default App;
