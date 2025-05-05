import { jwtDecode } from 'jwt-decode';

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        
        // Check if token is expired
        if (decoded.exp < currentTime) {
            // Token is expired, remove it from localStorage
            localStorage.removeItem("token");
            return false;
        }
        
        return true;
    } catch (error) {
        // If token is malformed or can't be decoded
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        return false;
    }
};

// Helper function to get user info from token
export const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};


export const refreshTokenIfNeeded = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // If token is about to expire (less than 5 minutes left)
      if (decoded.exp && decoded.exp - currentTime < 300) {
        // Call refresh endpoint
        const response = await fetch('https://localhost:3000/api/users/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.jwtToken);
          return true;
        }
      }
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };
