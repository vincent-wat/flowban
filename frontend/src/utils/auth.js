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

/*
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};
*/