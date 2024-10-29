import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarAlt.css';

const NavbarAlt = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">MyWebsite</Link>
        <div className="nav-links">
          <Link to="/login" className="nav-button">Login</Link>
          <Link to="/signup" className="nav-button">Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAlt;
