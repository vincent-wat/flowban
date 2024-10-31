import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h2>Profile Menu</h2>
      <ul>
        <li>
          <Link to="/profile" className="sidebar-link">Overview</Link>
        </li>
        <li>
        <Link to="/profile/settings" className="sidebar-link">Settings</Link>
        </li>
        <li>Activity</li>
        <li>Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;
