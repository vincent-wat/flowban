import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import './NavbarAlt.css';

const NavbarAlt = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Flowban</Link>
      <ul className="nav-links">
        <CustomLink to="/login">Login</CustomLink>
        <CustomLink to="/signup">Signup</CustomLink>
        <CustomLink to="/profile">Profile</CustomLink>
        <CustomLink to="/kanban">Kanban</CustomLink>
      </ul>
    </nav>
  );
};

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

export default NavbarAlt;
