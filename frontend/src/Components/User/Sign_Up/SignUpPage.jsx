import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SignUpPage.css";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "../../../axios";
import { baseURL } from "../../../axios";
import useAuth from "../../../hooks/useAuth";
import googleButton from "../../Assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png";
import api from "../../../axios";

const SignUpPage = () => {
  useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Password regex for validation
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  // Function to accept organization invitation
  const acceptInvitation = async (inviteToken, authToken) => {
    try {
      console.log("Accepting invitation with token:", inviteToken);
      setSubmitted(true);

      const response = await axios.post(
        "/api/organizations/invite-accept",
        { token: inviteToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data && response.data.jwtToken) {
        // Update the token with organization info
        localStorage.setItem("token", response.data.jwtToken);
        console.log("Organization invitation accepted, token updated");
      }

      // Clear the pending invite token
      sessionStorage.removeItem("pendingInviteToken");
      sessionStorage.removeItem("googleAuthFromInvite");

      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error accepting invitation after signup:", err);
      // Navigate to dashboard anyway
      navigate("/dashboard", { replace: true });
    }
  };

  // Handle Google authentication
  async function handleGoogleAuth() {
    try {
      // Check if there's a pending invite token
      // If we're coming from an invite, mark it
      // see if we're in an invite flow
      const pendingInviteToken = sessionStorage.getItem("pendingInviteToken");
      if (pendingInviteToken) {
        sessionStorage.setItem("googleAuthFromInvite", "true");
      }

      // Include redirect parameter if needed
      const redirectParam = pendingInviteToken ? "org-invite" : "";
      const response = await fetch(
        `${baseURL}/api/request?redirect=${redirectParam}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Auth URL received:", data);

      // Store the state or any identifier in localStorage if needed for verification

      // mark that we’re waiting on Google
      localStorage.setItem("googleAuthPending", "true");

      // Navigate to Google Auth

      // send the user off to Google
      window.location.href = data.url;
    } catch (error) {
      console.error("Error during auth request:", error);
      alert("Failed to authenticate with Google. Please try again later.");
    }
  }

  // Handle token detection and organization invitations
  useEffect(() => {
    console.log("useEffect running, checking for token and email");

    const urlParams = new URLSearchParams(window.location.search);
    console.log("URL params:", Object.fromEntries(urlParams.entries()));

    // Check for email from invitation link
    const emailParam = urlParams.get("email");
    if (emailParam) {
      setFormData((prev) => ({
        ...prev,
        email: emailParam,
      }));
      console.log("Email from invitation set:", emailParam);
    }

    // Check for JWT token from Google OAuth
    const token = urlParams.get("jwtToken");
    const redirectParam = urlParams.get("redirect");

    if (token) {
      console.log("Found JWT token in URL:", token);

      // Store the token in localStorage
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage");

      // Clear the googleAuthPending flag if it exists
      localStorage.removeItem("googleAuthPending");

      // Check if there's a pending invitation and redirect param is 'org-invite'
      const pendingInviteToken = sessionStorage.getItem("pendingInviteToken");
      const fromInvite = sessionStorage.getItem("googleAuthFromInvite");

      if (
        (pendingInviteToken && redirectParam === "org-invite") ||
        (pendingInviteToken && fromInvite === "true")
      ) {
        console.log("Detected pending invitation after Google auth");
        // Accept the invitation after Google signup
        acceptInvitation(pendingInviteToken, token);
      } else {
        // No invitation, proceed to dashboard
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate, location.search]);

  // Handle form input changes
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
      } else if (
        fieldName === "confirmPassword" &&
        value !== formData.password
      ) {
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation checks for the email
    if (!formData.email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await axios.get(
        `/api/validate-domain/${formData.email}`
      );
      if (!response.data.valid) {
        setError("Invalid email domain");
        return;
      }
    } catch (error) {
      setError("Invalid email domain");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include at least one number and one special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/api/users/register", {
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role_id: 1,
      });

      const authToken = response.data.jwtToken;
      localStorage.setItem("token", authToken);
      console.log("Registration successful!");

      setSubmitted(true);

      // Check if there's a pending invitation
      const pendingInviteToken = sessionStorage.getItem("pendingInviteToken");
      if (pendingInviteToken) {
        console.log("Found pending invitation token, accepting invitation");
        // Accept the invitation with the new auth token
        acceptInvitation(pendingInviteToken, authToken);
      } else {
        navigate("/dashboard");
      }
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
        <button type="submit">Sign Up</button>
        {submitted && (
          <p style={{ color: "green" }}>Form submitted successfully!</p>
        )}
      </form>
      <p className="register-link">
        Already registered?{" "}
        <span className="line">
          <a href="/login" style={{ color: "white" }}>
            Login
          </a>
        </span>
      </p>
      <h3>
        <button type="button" onClick={handleGoogleAuth}>
          <img
            src={googleButton}
            alt="Sign in with Google"
            style={{ width: "200px", height: "50px" }}
          />
        </button>
      </h3>
    </div>
  );
};

export default SignUpPage;
