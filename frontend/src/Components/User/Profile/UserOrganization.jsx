import React, { useState } from 'react';
import Sidebar from '../Profile/Sidebar'; 
import './UserOrganization.css';

function UserOrganization() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="organization-page">
      <Sidebar isOpen={isSidebarOpen} />
      <button onClick={toggleSidebar} className={`sidebar-toggle ${isSidebarOpen ? 'open' : ''}`}>
        {isSidebarOpen ? '❮' : '❯'}
      </button>

      <div className={`organization-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <h2>Settings</h2>

        </div>
      </div>
  );
}

export default UserOrganization;
