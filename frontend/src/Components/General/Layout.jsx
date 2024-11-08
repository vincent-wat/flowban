import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import './NavbarAlt.css';
import { isAuthenticated } from '../../utils/auth';

function Layout({ children }) {
  const authenticated = isAuthenticated();

  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <header>
        <nav className="navbar">
          <Link to="/" className="logo">Flowban</Link>
        <ul className="nav-links">
         {!authenticated && <CustomLink to="/login">Login</CustomLink>}
         {!authenticated && <CustomLink to="/signup">Signup</CustomLink>}
         <CustomLink to="/profile">Profile</CustomLink>
         <CustomLink to="/kanban">Kanban</CustomLink>
         <CustomLink to="/dashboard">Dashboard</CustomLink>
         {authenticated && (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
        </ul>
    </nav>{/* Replace with your actual navbar component or links */}
      </header>

      <main style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </main>

      <footer style={{ backgroundColor: '#C51D34', padding: '10px', color: 'white', textAlign: 'center' }}>
        <p>&copy; 2024 Flowban. All rights reserved.</p>
      </footer>
    </div>
)};

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}

function handleLogout() {
  localStorage.removeItem('token');
  window.location.reload();
}

export default Layout;
