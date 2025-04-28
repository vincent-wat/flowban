import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPopup.css';

const LoginPromptModal = ({ onClose }) => {
  return (
    <div className="login-prompt-overlay">
      <div className="login-prompt-modal">
        <div className="login-prompt-header">
          <h2>Authentication Required</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="login-prompt-body">
          <p>You need to be logged in to access this feature.</p>
          <div className="login-prompt-actions">
            <Link to="/login" className="login-button">Log In</Link>
            <Link to="/signup" className="signup-button">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;