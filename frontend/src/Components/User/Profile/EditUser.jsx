import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './EditUser.css';
import axios from 'axios'; 

function Profile() {
  const [profile, setProfile] = useState({
    email: '',
    password: '',
    phone_number: '',
    first_name: '',
    last_name: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const payload = {
        email: profile.email,
        phone_number: profile.phone_number,
        first_name: profile.first_name,
        last_name: profile.last_name,
      };

      if (profile.password) {
        payload.password = profile.password; 
      }

      const response = await axios.put('http://localhost:3000/api/users/me', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setProfile(response.data);
      setIsEditing(false);
      console.log('Profile updated:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="profile-page">
      <Sidebar isOpen={isSidebarOpen} />
      <button onClick={toggleSidebar} className={`sidebar-toggle ${isSidebarOpen ? 'open' : ''}`}>
        {isSidebarOpen ? '❮' : '❯'}
      </button>

      <div className={`profile-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="profile-content">
          <h2>Profile</h2>

          {isEditing ? (
            <div>
              <label className="profile-label">
                Email:
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
              <label className="profile-label">
                Password:
                <input
                  type="password"
                  name="password"
                  value={profile.password}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
              <label className="profile-label">
                Phone Number:
                <input
                  type="tel"
                  name="phone_number"
                  value={profile.phone_number}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
              <label className="profile-label">
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
              <label className="profile-label">
                Last Name:
                <input
                  type="text"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
              <button onClick={handleSave} className="profile-button">
                Save
              </button>
            </div>
          ) : (
            <div>
              <p className="profile-value"><strong>Email:</strong> {profile.email}</p>
              <p className="profile-value"><strong>Phone Number:</strong> {profile.phone_number}</p>
              <p className="profile-value"><strong>First Name:</strong> {profile.first_name}</p>
              <p className="profile-value"><strong>Last Name:</strong> {profile.last_name}</p>
              <button onClick={toggleEdit}className="profile-button"style={{ backgroundColor: 'red', color: 'white' }}>Edit Profile</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
