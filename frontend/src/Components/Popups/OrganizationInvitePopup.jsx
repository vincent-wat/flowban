import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './OrganizationInvitePopup.css';
import { Link } from 'react-router-dom';

const OrganizationInvitePopup = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (!token) {
      setError('Invalid invitation link. No token provided.');
      setLoading(false);
      return;
    }
    
    setInviteToken(token);
    
    // Try to decode the token to get the email and organization details
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length === 3) {
        // Decode the payload part (second part)
        const payload = JSON.parse(atob(parts[1]));
        setInviteEmail(payload.email || '');
      }
    } catch (err) {
      console.error('Error decoding token:', err);
    }
    
    // Check if user is already logged in
    const userToken = localStorage.getItem('token');
    setIsLoggedIn(!!userToken);
    
    // If logged in, try to accept the invitation automatically
    if (userToken) {
      acceptInvitation(token);
    } else {
      setLoading(false);
    }
  }, [location.search]);

  const acceptInvitation = async (token) => {
    try {
      setLoading(true);
      
      // Send request to accept the invitation
      const response = await axios.post('https://localhost:3000/api/organizations/invite-accept', 
        { token },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      setSuccess(true);
      setOrgName(response.data.organization || 'the organization');
      
      // Store the new token with organization_id in localStorage
      if (response.data.jwtToken) {
        localStorage.setItem('token', response.data.jwtToken);
        console.log('Updated JWT token with organization ID');
      }
      
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError(err.response?.data?.error || 'Failed to accept invitation. The link may be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Save the invitation token to sessionStorage
    sessionStorage.setItem('pendingInviteToken', inviteToken);
    navigate(`/login?email=${encodeURIComponent(inviteEmail)}&redirect=org-invite`);
  };

  const handleSignup = () => {
    // Save the invitation token to sessionStorage
    sessionStorage.setItem('pendingInviteToken', inviteToken);
    navigate(`/signup?email=${encodeURIComponent(inviteEmail)}&redirect=org-invite`);
  };

  const handleRedirect = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="org-invite-container">
      <div className="org-invite-card">
        <h1>Organization Invitation</h1>
        
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing your invitation...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => navigate('/')}>Go to Home</button>
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <h3>Invitation Accepted!</h3>
            <p>You have successfully joined {orgName}.</p>
            <button onClick={handleRedirect}>Go to Dashboard</button>
          </div>
        )}
        
        {!loading && !error && !success && !isLoggedIn && (
          <div className="login-options">
            <h3>Join Organization</h3>
            <p>You've been invited to join an organization. To accept this invitation, you need to sign in or create an account.</p>
            <p className="invite-email">{inviteEmail}</p>
            
            <div className="auth-buttons">
              <button onClick={handleLogin} className="login-button">Sign In</button>
              <button onClick={handleSignup} className="signup-button">Create Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationInvitePopup;