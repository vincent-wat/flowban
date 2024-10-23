import React from 'react';
import '../General/Home.css';  

function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Our Application</h1>
        <p>Your go-to solution for managing tasks, users, and more!</p>
      </header>

      <section className="home-content">
        <div className="home-section">
          <h2>Users Management</h2>
          <p>View and manage user profiles efficiently.</p>
        </div>

        <div className="home-section">
          <h2>Kanban Board</h2>
          <p>Organize tasks and track your team's progress with our Kanban board.</p>
        </div>

        <div className="home-section">
          <h2>Custom Forms</h2>
          <p>Create and fill out custom forms tailored to your needs.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
