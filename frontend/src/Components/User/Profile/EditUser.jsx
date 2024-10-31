import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './EditUser.css';

function Profile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "This is a short bio about John Doe.",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
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
                Name:
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
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
                Bio:
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="profile-input"
                />
              </label>
              <button onClick={toggleEdit} className="profile-button">
                Save
              </button>
            </div>
          ) : (
            <div>
              <p className="profile-value"><strong>Name:</strong> {profile.name}</p>
              <p className="profile-value"><strong>Email:</strong> {profile.email}</p>
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
