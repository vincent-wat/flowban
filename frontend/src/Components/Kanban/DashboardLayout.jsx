import React from 'react';
import { Link } from 'react-router-dom';

function DashboardLayout({ children }) {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
        <nav className="navbar">
          <Link to="/" className="logo">Flowban</Link>
          <ul className="nav-links">
            <CustomLink to="/profile">Profile</CustomLink>
          </ul>
        </nav>
      </header>
      <main style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </main>
    </div>
  );
}

function CustomLink({ to, children, ...props }) {
  return (
    <li>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default DashboardLayout;
