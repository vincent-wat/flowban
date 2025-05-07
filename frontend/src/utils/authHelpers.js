import axios from '../axios';

/**
 * Checks if the current user has admin role
 * @returns {Promise<boolean>} True if user is admin, false otherwise
 */
export const isUserAdmin = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const response = await axios.get('baseURL/api/users/roles', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data || !response.data.roles) return false;
    
    // Check if any role has name 'admin'
    return response.data.roles.some(role => 
      role.name.toLowerCase() === 'admin' || 
      role.name.toLowerCase() === 'owner' ||
      role.id === 2 ||
      role.id === 3
    );
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};