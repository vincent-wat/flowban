import React from 'react';
import '../General/Home.css';  
import { useNavigate } from "react-router-dom"
import { FaArrowRight } from 'react-icons/fa';
import graphic from '../Assets/kanbanboard.png';


function HomePage() {
  const navigate = useNavigate();
  const handleGetStartedClick = () => {
    navigate('/signup');
  };
  return (
    <div className="home-container">
      {/* Left Side Content (Text and Button) */}
      <div className="left-content">
        <h1 className="title">Welcome to Our Workflow Manager</h1>
        <p className="description">
          Manage tasks and forms more efficiently with our integrated Kanban boards and approval workflows.
        </p>
        <button className="get-started-btn" onClick={handleGetStartedClick}>
          Get Started <FaArrowRight />
        </button>
      </div>

      {/* Right Side Content (Graphic or Illustration) */}
      <div className="right-content">
        <img src={graphic} alt="Workflow Graphic" className="graphic-image" />
      </div>
    </div>
  );
}

export default HomePage;
