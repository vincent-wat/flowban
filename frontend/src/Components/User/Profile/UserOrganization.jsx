import React, { useState, useEffect } from 'react';
import Sidebar from '../Profile/Sidebar'; 
import './UserOrganization.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function UserOrganization() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchOrganizationUsers();
    fetchUserOrganizationInfo();
  }, []);

  const fetchOrganizationUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get('https://localhost:3000/api/organizations/users', {
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
        const response = await axios.get(
          `https://localhost:3000/api/organizations/${decoded.organization_id}`, // Note: using singular "organization"
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
      
      const response = await axios.post('https://localhost:3000/api/organizations/invite', 
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

  return (
    <div className="organization-page">
      <Sidebar isOpen={isSidebarOpen} />
      <button onClick={toggleSidebar} className={`sidebar-toggle ${isSidebarOpen ? 'open' : ''}`}>
        {isSidebarOpen ? '❮' : '❯'}
      </button>

      <div className={`organization-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <h1>Organization: {orgName || 'Not Available'}</h1>
        
        {/* Invite Users Section */}
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
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{`${user.first_name} ${user.last_name}`}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserOrganization;