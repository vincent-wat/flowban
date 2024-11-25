import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { isAuthenticated } from '../../../utils/auth';

function Sidebar({ isOpen }) {
  const authenticated = isAuthenticated();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate("/");
  }

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
        <li>
          <button onClick={handleLogout} className="sidebar-link">
            Logout
          </button>
        </li>
        <li>Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;
