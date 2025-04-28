import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import LoginPromptModal from '../Popups/LoginPopup.jsx';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const authenticated = isAuthenticated();
    
    useEffect(() => {
        // If not authenticated and modal not showing yet, show the modal
        if (!authenticated && !showLoginPrompt) {
            setShowLoginPrompt(true);
        }
        
        // Set up periodic checks for token expiration
        const intervalId = setInterval(() => {
            if (!isAuthenticated() && !showLoginPrompt) {
                console.log("Token expired during session");
                setShowLoginPrompt(true);
            }
        }, 10000); // Check every 10 seconds (for testing)
        
        return () => clearInterval(intervalId);
    }, [authenticated, showLoginPrompt]);
    
    // Close the modal and navigate to home
    const handleCloseModal = () => {
        setShowLoginPrompt(false);
        navigate('/');
    };
    
    // If not authenticated, show login prompt modal
    if (!authenticated) {
        return showLoginPrompt ? 
            <LoginPromptModal onClose={handleCloseModal} /> : 
            null;
    }
    
    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;