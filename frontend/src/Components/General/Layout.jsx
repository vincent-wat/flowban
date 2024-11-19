import React, { useState } from 'react';
import { Link, useMatch, useResolvedPath, useNavigate } from 'react-router-dom';
import './NavbarLayout.css';
import { isAuthenticated } from '../../utils/auth';

function Layout({ children }) {
  const authenticated = isAuthenticated();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate("/");
  }

  function toggleDropdown() {
    setIsDropdownOpen((prev) => !prev);
  }

  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <header>
        <nav className="navbar">
          <Link to="/" className="logo">Flowban</Link>
          <ul className="nav-links">
            {!authenticated && <CustomLink to="/login">Login</CustomLink>}
            {!authenticated && <CustomLink to="/signup">Signup</CustomLink>}
            <CustomLink to="/dashboard">Dashboard</CustomLink>

            {authenticated && (
              <li className="profile-menu">
                <button onClick={toggleDropdown} className="profile-button">
                  Profile
                </button>
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/profile/settings">Settings</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </main>

      <footer style={{ backgroundColor: '#C51D34', padding: '10px', color: 'white', textAlign: 'center' }}>
        <p>&copy; 2024 Flowban. All rights reserved.</p>
      </footer>
    </div>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Layout;
