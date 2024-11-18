import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";
//import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "../../../axios";
import useAuth from "../../../hooks/useAuth";

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
    // Where we use axios to add a new user to the database
    try {
      console.log(formData);
      console.log("user url: " + USER_URL);
      const response = await axios.post(USER_URL, {
        // right side must be the attribute name is database
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.jwtToken);
      console.log(JSON.stringify(response));
      setSubmitted(true);
      navigate("/dashboard");
    } catch (e) {
      console.error(e.message);
    }

    setError("");
    setSubmitted(true);
    // need to clear the input fields afterwards still
    // Normally, here you would send form data to your backend
    //console.log(formData);
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
    </div>
  );
};

export default SignUpPage;
