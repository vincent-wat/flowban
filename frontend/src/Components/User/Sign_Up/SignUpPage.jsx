import React, { useState } from 'react';
import './SignUpPage.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

 

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form data state
    setFormData({
      ...formData,
      [name]: value
    });



    // Perform validation checks
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password' && !passwordRegex.test(value)) {
        setError('Password must be at least 8 characters long and include at least one number and one special character.');
      } else if (name === 'confirmPassword' && value !== formData.password) {
        setError('Passwords do not match');
      } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setError('Passwords do not match');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and include at least one number and one special character.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setSubmitted(true);
  
    try {
      const response = await fetch('http://localhost:3001/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log('User signed up successfully');
      } else {
        console.error('Failed to sign up user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit} className="signup-form">
        <h1>Sign Up</h1>

        <div className="input-box">
          <input
            type="First Name"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <input
            type="Last Name"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <input
            type="phone_number"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="input-box">
          <input 
            type="password" 
            name="password"
            placeholder='Password' 
            required
            value={formData.password}
            onChange={handleChange}
          />
          <RiLockPasswordFill className='icon'/>
        </div>
        
        <div className="input-box">
          <input 
            type="password" 
            name="confirmPassword"
            placeholder='Re-Enter Password' 
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <RiLockPasswordFill className='icon'/>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type='submit'>Sign Up</button>
        {submitted && <p style={{ color: 'green' }}>Form submitted successfully!</p>}
      </form>
    </div>
  );
};

export default SignUpPage;