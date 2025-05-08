import React, { useState, useEffect } from 'react';
import Sidebar from '../Profile/Sidebar'; 
import './UserOrganization.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { isUserAdmin } from '../../../utils/authHelpers';
import api from "../../../axios";

function UserOrganization() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [hasOrganization, setHasOrganization] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [createOrgStatus, setCreateOrgStatus] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      console.log("Refreshing token to get latest organization data...");
      
      const response = await api.post("/api/users/register", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.jwtToken) {
        console.log("Token refreshed successfully");
        localStorage.setItem('token', response.data.jwtToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      // Direct API call to get roles
      const response = await api.get('/api/users/roles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Roles response:', response.data);
      
      // Check if user has admin role (id=2)
      if (response.data && response.data.roles) {
        const hasAdminRole = response.data.roles.some(role => 
          role.id === 2 || role.name.toLowerCase() === 'admin' ||
          role.id === 3 || role.name.toLowerCase() === 'owner'
        );
        const hasOwnerRole = response.data.roles.some(role => 
          role.id === 3 || role.name.toLowerCase() === 'owner'
        );
        
        setIsOwner(hasOwnerRole);
        setIsAdmin(hasAdminRole);
        console.log('User is admin:', hasAdminRole);
        console.log('User is owner:', hasOwnerRole);
      } else {
        setIsAdmin(false);
        setIsOwner(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsOwner(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRoleChange = async (userId, newRoleId, currentRole) => {
    // Set loading state for this specific user
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Call API to update user's role
      await api.post("/api/users/role", 
        { 
          userId, 
          roleId: newRoleId 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state to reflect the change without needing a full refetch
      setUsers(prevUsers => prevUsers.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            role: newRoleId === 2 ? 'admin' : 'user'
          };
        }
        return user;
      }));
      
      console.log(`User ${userId} role changed from ${currentRole} to ${newRoleId === 2 ? 'admin' : 'user'}`);
    } catch (error) {
      console.error('Error changing user role:', error);
    } finally {
      // Clear loading state for this user
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const checkOrganizationStatus = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      
      // Check if organization_id exists in the token
      const hasOrg = !!decoded.organization_id;
      setHasOrganization(hasOrg);
      return hasOrg;
    } catch (error) {
      console.error('Error checking organization status:', error);
      setHasOrganization(false);
      return false;
    }
  };
  

  useEffect(() => {
    const initializeData = async () => {
      await refreshToken();
      const hasOrg = checkOrganizationStatus();
      
      if (hasOrg) {
        await checkAdminStatus();
        await Promise.all([
          fetchOrganizationUsers(),
          fetchUserOrganizationInfo()
        ]);
      } else {
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);


  const fetchOrganizationUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.get('/api/organizations/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error('Error fetching organization users:', err);
      setError('Failed to fetch users from your organization');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrganizationInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Decode token to get organization_id
      const decoded = jwtDecode(token);
      if (decoded && decoded.organization_id) {
        // Fetch organization details using organization_id
        const response = await api.get(
          `/api/organizations/${decoded.organization_id}`, // Note: using singular "organization"
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data && response.data.name) {
          setOrgName(response.data.name);
        }
      }
    } catch (err) {
      console.error('Error fetching organization info:', err);
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setInviteStatus(null);
    
    if (!inviteEmail) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.post('/api/organizations/invite', 
        { email: inviteEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setInviteStatus({ success: true, message: 'Invitation sent successfully!' });
      setInviteEmail('');
    } catch (err) {
      console.error('Error inviting user:', err);
      setInviteStatus({ 
        success: false, 
        message: err.response?.data?.error || 'Failed to send invitation'
      });
    }
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    setCreateOrgStatus(null);
    
    if (!newOrgName) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Get current user ID from token
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      
      const response = await api.post('/api/organizations/create', 
        { 
          name: newOrgName,
          userId: userId 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local token with new organization_id
      await refreshToken();
      
      setCreateOrgStatus({ 
        success: true, 
        message: 'Organization created successfully!' 
      });
      
      // Reset form and update state to show organization view
      setNewOrgName('');
      setHasOrganization(true);
      
      // Fetch organization data
      await Promise.all([
        fetchOrganizationUsers(),
        fetchUserOrganizationInfo()
      ]);
      
      // User automatically becomes admin when creating an organization
      setIsAdmin(true);
      
    } catch (err) {
      console.error('Error creating organization:', err);
      setCreateOrgStatus({ 
        success: false, 
        message: err.response?.data?.error || 'Failed to create organization'
      });
      setLoading(false);
    }
  };

  return (
    <div className="organization-page">
      <Sidebar isOpen={isSidebarOpen} />
      <button onClick={toggleSidebar} className={`sidebar-toggle ${isSidebarOpen ? 'open' : ''}`}>
        {isSidebarOpen ? '❮' : '❯'}
      </button>

      <div className={`organization-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {hasOrganization ? (
          // User is part of an organization - show organization details
          <>
            <h1>Organization: {orgName || 'Not Available'}</h1>
            
            {/* Invite Users Section - Only visible to admins */}
            {isAdmin && (
              <div className="invite-section">
                <h2>Invite New Members</h2>
                <form onSubmit={handleInviteUser} className="invite-form">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                  <button type="submit">Send Invite</button>
                </form>
                
                {inviteStatus && (
                  <div className={`invite-status ${inviteStatus.success ? 'success' : 'error'}`}>
                    {inviteStatus.message}
                  </div>
                )}
              </div>
            )}
            
            {/* Organization Members Section */}
            <div className="members-section">
              <h2>Organization Members</h2>
              
              {loading && <p>Loading users...</p>}
              {error && <p className="error-message">{error}</p>}
              
              {!loading && !error && (
                <div className="members-list">
                  {users.length === 0 ? (
                    <p>No members found in your organization.</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          {isOwner && <th>Actions</th>} {/* Only show actions column for owners */}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td>{`${user.first_name} ${user.last_name}`}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            {isOwner && (
                              <td>
                                {user.role?.toLowerCase() !== 'owner' && (
                                  <button 
                                    className="role-action-button"
                                    onClick={() => handleRoleChange(
                                      user.id, 
                                      user.role?.toLowerCase() === 'admin' ? 1 : 2, // Toggle between admin (2) and user (1)
                                      user.role
                                    )}
                                    disabled={actionLoading[user.id]}
                                  >
                                    {actionLoading[user.id] ? 'Processing...' : 
                                      user.role?.toLowerCase() === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                  </button>
                                )}
                                {user.role?.toLowerCase() === 'owner' && (
                                  <span className="owner-label">Owner</span>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          // User is not part of an organization - show create form
          <div className="create-org-section">
            <h1>Create Organization</h1>
            <p>You are not currently part of any organization. Create one to collaborate with your team.</p>
            
            <form onSubmit={handleCreateOrganization} className="create-org-form">
              <input
                type="text"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Enter organization name"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
            </form>
            
            {createOrgStatus && (
              <div className={`status-message ${createOrgStatus.success ? 'success' : 'error'}`}>
                {createOrgStatus.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserOrganization;