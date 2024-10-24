import React, { Fragment, useState } from 'react';
import './SignUpPage.css';  // Optional, for custom styling

const SignUpPage = () => {

  // basic sign up info
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const {input, value } = e.target;
    setFormData({
      ...formData,
      [input]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally, here you would send form data to your backend
    console.log(formData);
    setSubmitted(true);
  };

  return (
    <>
      <form method='post' onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div>
          <label > Username: 
          <input type="text" name="name" 
          value={formData.username} onChange={handleChange}
          placeholder='Username'/>
          </label>
        <br />
          <label > Email: 
            <input type="email" name="email"
            value={formData.email} onChange={handleChange}
            placeholder='Please Enter Email' />
          </label>
        <br />
        <label > Password:
          <input type="password" name="password" 
          value={formData.password} onChange={handleChange}
          placeholder='Enter a password' />
        </label>
        </div>
        </form>  
    </>
  );
};

export default SignUpPage;
