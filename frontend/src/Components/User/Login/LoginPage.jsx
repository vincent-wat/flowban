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
        try {
            const response = await axios.post("/api/users/login", {
                email: formData.email,
                password: formData.password,
            });
            console.log(response.data);
            localStorage.setItem("token", response.data.jwtToken);
            setSubmitted(true);
            navigate("/dashboard");
        } catch (e) {
            console.error(e.message);
            setError("Invalid credentials");
        }
        setError("");
        setSubmitted(true);
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
                    <a href="#">Forgot Password?</a>
                </div>
                <button type='submit'>Login</button>
                {submitted && (
                    <p style={{ color: "green" }}>Form submitted successfully!</p>
                )}
                <div className="register">
                    <p>Don't have an account? <a href="/signup">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;