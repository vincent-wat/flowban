import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";
//import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "../../../axios";
import useAuth from "../../../hooks/useAuth";
import googleButton from "../../Assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png"

function navigateToGoogleAuth(url) {
  window.location.href = url;
}

async function auth() {
  try {
    const response = await fetch("https://localhost:3000/api/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Auth URL received:", data);
    navigateToGoogleAuth(data.url);
  } catch (error) {
    console.error("Error during auth request:", error);
    alert("Failed to authenticate with Google. Please try again later.");
  }
}


const SignUpPage = () => {
  useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  // base url for new users to be added
  const USER_URL = "/api/users/register";

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;

    // Update the form data state
    setFormData({
      ...formData,
      [fieldName]: value,
    });

    
    // Perform validation checks for passwords
    if (fieldName === "password" || fieldName === "confirmPassword") {
      if (fieldName === "password" && !passwordRegex.test(value)) {
        setError(
          "Password must be at least 8 characters long and include at least one number and one special character."
        );
      } else if (fieldName === "confirmPassword" && value !== formData.password) {
        setError("Passwords do not match");
      } else if (
        fieldName === "password" &&
        formData.confirmPassword &&
        value !== formData.confirmPassword
      ) {
        setError("Passwords do not match");
      } else {
        setError("");
      }
    }



  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation checks for the email
    if (!formData.email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await axios.get(`/api/validate-domain?email=${formData.email}`);
      if (!response.data.valid) {
        setError("Invalid email domain");
        return;
      }
    } catch (error) {
      setError("Invalid email domain");
      return;
    }
    
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters long and include at least one number and one special character.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      const response = await axios.post(USER_URL, {
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role_id: 1, 
      });
  
      localStorage.setItem("token", response.data.jwtToken);
      console.log("Request Submitted!");
      
      setSubmitted(true);
      navigate("/dashboard");
  
    } catch (e) {
      console.error("Error:", e.response?.data?.message || e.message);
      setError(e.response?.data?.message || "Server error");  
    }
  };
  

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        <div className="input-box">
          <input
            type="text"
            name="firstName"
            //autoComplete="off"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="lastName"
            //autoComplete="off"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <input
            type="tel"
            name="phoneNumber"
            autoComplete="off"
            placeholder="Phone Number"
            value={formData.phoneNumber}
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
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <RiLockPasswordFill className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-Enter Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <RiLockPasswordFill className="icon" />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* Should create some kind of way so sumbit button does not work without 
          all fields written into or is valid*/}
        <button type="submit">Sign Up</button>
        {submitted && (
          <p style={{ color: "green" }}>Form submitted successfully!</p>
        )}
      </form>
      <p>
        Already registered? <br />
        <span className="line">
          {/* Need to add link to login page*/}
          <a href="/login" style={{ color: "white" }}>
            Sign In
          </a>
        </span>
      </p>
      <h3>
      <button type="button" onClick={() => auth()}>
        <img src={googleButton} alt="Sign in with Google" style={{ width: "200px", height: "50px" }} />
      </button>
      </h3>
    </div>
  );
};

export default SignUpPage;
