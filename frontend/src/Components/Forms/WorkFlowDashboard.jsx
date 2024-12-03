// src/pages/WorkflowDashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Forms/WorkFlowDashboard.css';

function WorkflowDashboard() {
  const [formInstances, setFormInstances] = useState([]);

  useEffect(() => {
    // Fetch all form instances from the backend using the given endpoint
    axios.get('http://localhost:3000/api/formInstance/instances')
      .then(response => {
        setFormInstances(response.data);
      })
      .catch(error => {
        console.error('Error fetching form instances:', error);
      });
  }, []);

  return (
    <div className="workflow-dashboard-container">
      <h1>All Workflows</h1>
      <div className="workflow-list">
        <div className="workflow-header">
          <span className="workflow-column-name">Name</span>
          <span className="workflow-column-status">Status</span>
          <span className="workflow-column-action">Action</span>
        </div>
        {formInstances.length > 0 ? (
          formInstances.map(instance => (
            <div key={instance.id} className="workflow-row">
              <span className="workflow-column-name">
                {instance.template_name || `Workflow ${instance.id}`}
              </span>
              <span className={`workflow-column-status ${instance.status.toLowerCase()}`}>
                {instance.status}
              </span>
              <span className="workflow-column-action">
                <Link to={`/form/${instance.id}`}>
                  <button className="view-button">View</button>
                </Link>
              </span>
            </div>
          ))
        ) : (
          <p>No workflows available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default WorkflowDashboard;
