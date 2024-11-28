import React, { useEffect, useState } from 'react'; 
import { useNavigate } from "react-router-dom";
import './ResetPassword.css';
import axios from '../../../axios';
import useAuth from '../../../hooks/useAuth';


const ResetPassword = () => {
    useAuth();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    
    useEffect(() => {
        
        const authorizeResetToken = async () => {
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const resetToken = queryParams.get('token');
                console.log("resetToken", resetToken);
                if (!resetToken) {
                    throw new Error('No token found. Please try again.');
                }
                const response = await axios.get(`/api/users/token/${resetToken}`);
                if (!response.data) {
                    navigate("/error");
                };
                console.log("response ", response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
        authorizeResetToken();
    }, []);

    
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the form data state
        setFormData({
            ...formData,
            [name]: value,
        });

        // Perform validation checks
        if (name === "password" || name === "confirmPassword") {
            if (name === "password" && !passwordRegex.test(value)) {
              setError(
                "Password must be at least 8 characters long and include at least one number and one special character."
              );
            } else if (name === "confirmPassword" && value !== formData.password) {
              setError("Passwords do not match");
            } else if (
              name === "password" &&
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
        setError("");
        setSubmitted(false);

        try {
            const queryParams = new URLSearchParams(window.location.search);
            const resetToken = queryParams.get('token');
            const response = await axios.put("/api/users/reset-password", {
                password_reset_token: resetToken,
                password: formData.password,
            });
            console.log(response.data);
            setSubmitted(true);
            navigate("/login"); 
            } catch (e) {
                console.error(e.message);
                setError("Invalid password. Please try again.");
            }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <div className="input-box">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );


};

export default ResetPassword;