import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './ForgotPassword.css';
import axios from '../../../axios';
import useAuth from '../../../hooks/useAuth';

const ForgotPassword = () => {

    const [formData, setFormData] = useState({
        email: "",
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
        setError("");
        setSubmitted(false);

        try {
            const response = await axios.post("/api/users/forgot-password", {
                email: formData.email,
            });
            console.log(response.data);
            setSubmitted(true);

        } catch (e) {
            console.error(e.message);
            setError("Invalid email. Please try again.");
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Forgot Password</h1>
                <div className="input-box">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
                {submitted && (
                    <p style={{ color: "white" }}>We will email you the link to reset the password.</p>
                )}
                {error && (
                    <p style={{ color: "white", marginTop: "10px", marginBottom: "10px" }}>
                        {error}
                    </p>
                )}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    )


};

export default ForgotPassword;
