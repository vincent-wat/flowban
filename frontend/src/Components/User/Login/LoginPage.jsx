import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "../../../axios";
import useAuth from "../../../hooks/useAuth";

const LoginPage = () => {
    useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
                <div className="register">
                    <p>Don't have an account? <a href="/signup">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
