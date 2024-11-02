import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './EditUser.css';
import axios from 'axios';  // Import axios if using it

function Profile() {
  const [profile, setProfile] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/1');
        const data = await response.json();
        setProfile(data);
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
      // Make a PUT request to update the user profile
      const response = await axios.put(`http://localhost:3000/users/1`, {
        email: profile.email,
        password: profile.password,
        phone_number: profile.phoneNumber,
        first_name: profile.firstName,
        last_name: profile.lastName,
        bio: profile.bio,
      });
      console.log('Profile updated:', response.data);
      setIsEditing(false);  // Exit edit mode after successful update
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
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
              <label className="profile-label">
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
              <label className="profile-label">
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
              <label className="profile-label">
                Bio:
                <textarea
                  name="bio"
                  value={profile.bio}
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
              <p className="profile-value"><strong>Phone Number:</strong> {profile.phoneNumber}</p>
              <p className="profile-value"><strong>First Name:</strong> {profile.firstName}</p>
              <p className="profile-value"><strong>Last Name:</strong> {profile.lastName}</p>
              <p className="profile-value"><strong>Bio:</strong> {profile.bio}</p>
              <button onClick={toggleEdit} className="profile-button">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
