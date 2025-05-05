import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from '../../../axios';
import useAuth from '../../../hooks/useAuth';
import googleButton from '../../Assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png';

const LoginPage = () => {
  useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Handle redirect back from Google OAuth
  useEffect(() => {
    // Check for Google OAuth token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('jwtToken');
    
    // Check for email parameter which may come from org invite link
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
    
    // Check for redirect parameter which indicates where the user came from
    const redirectParam = urlParams.get('redirect');
    
    if (token) {
      // Handle Google OAuth redirect
      localStorage.setItem('token', token);
      localStorage.removeItem('googleAuthPending');
      
      // Check if we need to handle an org invite after Google login
      const pendingInviteToken = sessionStorage.getItem('pendingInviteToken');
      const fromInvite = sessionStorage.getItem('googleAuthFromInvite');
      
      if ((pendingInviteToken && redirectParam === 'org-invite') || 
          (pendingInviteToken && fromInvite === 'true')) {
        // Accept the invitation using the new token
        acceptInvitation(pendingInviteToken, token);
        // Clean up session storage
        sessionStorage.removeItem('googleAuthFromInvite');
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const acceptInvitation = async (inviteToken, authToken) => {
    try {
      setSubmitted(true); // Show loading state
      
      const response = await axios.post(
        '/api/organizations/invite-accept',
        { token: inviteToken },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          } 
        }
      );
      
      if (response.data && response.data.jwtToken) {
        // Update the token with organization info
        localStorage.setItem('token', response.data.jwtToken);
        console.log('Organization invitation accepted, token updated');
      }
      
      // Clear the pending invite token
      sessionStorage.removeItem('pendingInviteToken');
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error accepting invitation after login:', err);
      setError('Failed to accept organization invitation. Please try again.');
      setSubmitted(false);
      navigate('/dashboard', { replace: true });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);
    try {
      const response = await axios.post('/api/users/login', {
        email: formData.email,
        password: formData.password,
      });
      
      const authToken = response.data.jwtToken;
      localStorage.setItem('token', authToken);
      setSubmitted(true);
      
      // Check if there's a pending invitation
      const pendingInviteToken = sessionStorage.getItem('pendingInviteToken');
      if (pendingInviteToken) {
        // Accept the invitation
        acceptInvitation(pendingInviteToken, authToken);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
    }
  };

const handleGoogleAuth = async () => {
  try {
    // Get the invite token from session storage
    const pendingInviteToken = sessionStorage.getItem('pendingInviteToken');
    
    // Store a flag indicating we're coming from an org invite
    if (pendingInviteToken) {
      sessionStorage.setItem('googleAuthFromInvite', 'true');
    }
    
    // Make the request with the redirect parameter if we have a pending invite
    const redirectParam = pendingInviteToken ? 'org-invite' : '';
    const response = await fetch(`https://localhost:3000/api/request?redirect=${redirectParam}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const data = await response.json();
    localStorage.setItem('googleAuthPending', 'true');
    window.location.href = data.url;
  } catch (err) {
    console.error(err);
    alert('Failed to authenticate with Google. Please try again later.');
  }
};

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="icon toggle-password" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
        {submitted && <p className="success-msg">Login successful! Redirecting...</p>}
        {error && <p className="error-msg">{error}</p>}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="google-btn"
        >
          <img
            src={googleButton}
            alt="Sign in with Google"
            className="google-img"
          />
        </button>
        <div className="register">
          <p>
            Don't have an account? <a href="/signup">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
