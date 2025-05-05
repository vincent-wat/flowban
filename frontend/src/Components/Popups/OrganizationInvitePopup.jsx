import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './OrganizationInvitePopup.css'; // We'll create this CSS file next

const OrganizationInvitePopup = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orgName, setOrgName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const acceptInvitation = async () => {
      try {
        setLoading(true);
        
        // Get token from URL params
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('Invalid invitation link. No token provided.');
          setLoading(false);
          return;
        }
        
        // Send request to accept the invitation
        const response = await axios.post('https://localhost:3000/api/organizations/invite-accept', 
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        setSuccess(true);
        setOrgName(response.data.organization || 'the organization');
        
        // If user is logged in and accepting the invite, store the new token
        if (response.data.jwtToken) {
          localStorage.setItem('token', response.data.jwtToken);
        }
        
      } catch (err) {
        console.error('Error accepting invitation:', err);
        setError(err.response?.data?.error || 'Failed to accept invitation. The link may be expired or invalid.');
      } finally {
        setLoading(false);
      }
    };
    
    acceptInvitation();
  }, [location.search, navigate]);

  const handleRedirect = () => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
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
            <button onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <h3>Invitation Accepted!</h3>
            <p>You have successfully joined {orgName}.</p>
            <button onClick={handleRedirect}>
              {localStorage.getItem('token') ? 'Go to Dashboard' : 'Login to Access'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationInvitePopup;