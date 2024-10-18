import React, { useState } from 'react';

function Profile() {
  // Hardcoded user values
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "This is a short bio about John Doe.",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  // Toggle between view and edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <h1>Profile</h1>
      
      {isEditing ? (
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Bio:
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
            />
          </label>
          <br />
          <button onClick={toggleEdit}>Save</button>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <button onClick={toggleEdit}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
