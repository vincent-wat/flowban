import React from 'react';
import { Link, useMatch, useResolvedPath} from 'react-router-dom';
import '../General/Navbar.css';
export default function Navbar() {
    return (
        <nav className="nav">
            <Link to="/" className="site-name"> FlowBan </Link>
            <ul>
                <CustomLinks to='/sign_up'> Sign Up </CustomLinks>
                <CustomLinks to="/login"> Login </CustomLinks>
                <CustomLinks to='/profile'> Profile </CustomLinks>
            </ul>
        </nav>
    );
}

// custom link prop for routes in the navbar
// the useResolvedPath allows for relative or absolute paths to enures full paths no
// matter what

function CustomLinks({to, children, ...props}) {
    //const path = window.location.pathname
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path: resolvedPath.pathname, end: true})
    return (
        <li className={isActive? "active" : ""}>
            <Link to={to} {...props}>{children}</Link>
        </li>
    )
}

// 