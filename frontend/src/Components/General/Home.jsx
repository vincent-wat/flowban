// Home.jsx
import React from 'react';
import '../General/Home.css';  
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaUserTie, FaRocket } from 'react-icons/fa';
import graphic from '../Assets/kanbanboard.png';

function HomePage() {
  const navigate = useNavigate();
  const handleGetStartedClick = () => {
    navigate('/signup');
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="left-content">
          <h1 className="title">Streamline Your Workflow with Ease</h1>
          <p className="description">
            Manage tasks and forms more efficiently with our integrated Kanban boards and approval workflows.
          </p>
          <button className="get-started-btn" onClick={handleGetStartedClick}>
            Get Started <FaArrowRight />
          </button>
        </div>
        <div className="right-content">
          <img src={graphic} alt="Workflow Graphic" className="graphic-image" />
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">  
        <div className="features-wrapper">
        <h2>Why Choose Our Workflow Manager?</h2>
        <div className="features">
          <div className="feature-card">
            <FaCheckCircle className="feature-icon" />
            <h3>Efficient Task Management</h3>
            <p>Organize your tasks with drag-and-drop Kanban boards.</p>
          </div>
          <div className="feature-card">
            <FaUserTie className="feature-icon" />
            <h3>Approval Workflows</h3>
            <p>Seamlessly manage approvals and automate processes.</p>
          </div>
          <div className="feature-card">
            <FaRocket className="feature-icon" />
            <h3>Boost Productivity</h3>
            <p>Optimize your workflow and get more done in less time.</p>
          </div>
        </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials">
          <div className="testimonial-card">
            <p>"This workflow manager has transformed the way our team collaborates!"</p>
            <h4>- Alex Johnson</h4>
          </div>
          <div className="testimonial-card">
            <p>"A game-changer for task management. Highly recommended!"</p>
            <h4>- Maria Lopez</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

