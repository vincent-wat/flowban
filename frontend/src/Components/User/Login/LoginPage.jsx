import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import { FaUser } from "react-icons/fa";
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
      
      // Store the state or any identifier in localStorage if needed for verification
      localStorage.setItem("googleAuthPending", "true");
      
      navigateToGoogleAuth(data.url);
    } catch (error) {
      console.error("Error during auth request:", error);
      alert("Failed to authenticate with Google. Please try again later.");
    }
}

const LoginPage = () => {
    useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleGoogleAuth() {
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
          
          // Store the state or any identifier in localStorage if needed for verification
          localStorage.setItem("googleAuthPending", "true");
          
          // Navigate to Google Auth
          window.location.href = data.url;
        } catch (error) {
          console.error("Error during auth request:", error);
          alert("Failed to authenticate with Google. Please try again later.");
        }
      }

      // Modified useEffect to handle Google auth redirect
    useEffect(() => {
        console.log("useEffect running, checking for token");
        console.log("Current URL:", window.location.href);
        
        const urlParams = new URLSearchParams(window.location.search);
        console.log("URL params:", Object.fromEntries(urlParams.entries()));
        
        const token = urlParams.get("jwtToken"); // Match the parameter name from oAuthController
        
        if (token) {
        console.log("Found JWT token in URL:", token);
        
        // Store the token in localStorage
        localStorage.setItem("token", token);
        console.log("Token stored in localStorage");
        
        // Clear the googleAuthPending flag if it exists
        localStorage.removeItem("googleAuthPending");
        
        // Use React Router's navigate for redirection
        navigate("/dashboard", { replace: true });
        } else {
        console.log("No token found in URL");
        }
    }, [navigate]);
      

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the form data state
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous error message
        setSubmitted(false); // Reset submission state

        try {
            const response = await axios.post("/api/users/login", {
                email: formData.email,
                password: formData.password,
            });
            // Successful login
            console.log(response.data);
            localStorage.setItem("token", response.data.jwtToken);
            setSubmitted(true); // Set submitted state to true only on successful login
            navigate("/dashboard");
        } catch (e) {
            // Handle login failure
            console.error(e.message);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="input-box">
                    <input
                        type="email"
                        name="email"
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <FaUser className='icon' />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        name="password"
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <RiLockPasswordFill className='icon' />
                </div>
                <div className="remember-forgot">
                    <label><input type='checkbox' />Remember Me</label>
                    <a href="/forgot-password">Forgot Password?</a>
                </div>
                <button type='submit'>Login</button>
                {submitted && (
                    <p style={{ color: "white" }}>Login successful! Redirecting...</p>
                )}
                {error && (
                    <p style={{ color: "white", marginTop: "10px", marginBottom: "10px" }}>
                        {error}
                    </p>
                )}
                <button type="button" onClick={handleGoogleAuth}>
                    <img src={googleButton} alt="Sign in with Google" style={{ width: "200px", height: "50px" }} />
                </button>
                <div className="register">
                    <p>Don't have an account? <a href="/signup">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
