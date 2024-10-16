import React, { useState } from 'react';
import './SignUpPage.css';  // Optional, for custom styling

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally, here you would send form data to your backend
    console.log(formData);
    setSubmitted(true);
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {submitted ? (
        <p>Thank you for signing up, {formData.username}!</p>
      ) : (
        <form onSubmit={handleSubmit} className="signup-form">
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
};

export default SignUpPage;
