import React, { useState } from 'react';
import Sidebar from '../Profile/Sidebar'; 
import './Settings.css';

function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="settings-page">
      <Sidebar isOpen={isSidebarOpen} />
      <button onClick={toggleSidebar} className={`sidebar-toggle ${isSidebarOpen ? 'open' : ''}`}>
        {isSidebarOpen ? '❮' : '❯'}
      </button>

      <div className={`settings-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <h2>Settings</h2>

        <div className="settings-option">
          <label>
            <input
              type="checkbox"
              name="notifications"
            />
            Enable Notifications
          </label>
        </div>

        <div className="settings-option">
          <label>
            <input
              type="checkbox"
              name="darkMode"
            />
            Enable Dark Mode
          </label>
        </div>
      </div>
    </div>
  );
}

export default Settings;
