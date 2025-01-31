import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import './WorkflowBoardPage.css';

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"]
});

export const WorkflowBoard = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [stages, setStages] = useState([]);
  const [formInstances, setFormInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForms, setLoadingForms] = useState({}); // Track loading state for each form

  // Function to fetch workflow data
  const fetchWorkflowData = async () => {
    try {
      const stagesResponse = await fetch(`http://localhost:3000/api/workflowStages/${templateId}`);
      if (!stagesResponse.ok) {
        throw new Error(`Error fetching stages! Status: ${stagesResponse.status}`);
      }
      const stagesData = await stagesResponse.json();
      setStages(stagesData);

      const formInstancesResponse = await fetch(`http://localhost:3000/api/formInstance/instances/${templateId}`);
      const formInstancesData = await formInstancesResponse.json();
      setFormInstances(formInstancesData);
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflowData();

    // Set up WebSocket listener inside useEffect
    const handleFormUpdate = ({ id, newStatus }) => {
      console.log(`Received WebSocket update: Form ${id} -> ${newStatus}`);
      fetchWorkflowData(); // Auto-refresh board on WebSocket update
    };

    socket.on("formUpdated", handleFormUpdate);

    return () => {
      socket.off("formUpdated", handleFormUpdate);
    };
  }, [templateId]);

  const handleApprove = async (formId) => {
    setLoadingForms((prev) => ({ ...prev, [formId]: true })); // Disable button & show spinner

    try {
      const response = await fetch(`http://localhost:3000/api/formInstance/instances/approve/${formId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to approve form ${formId}`);
      }

      fetchWorkflowData(); //  Auto-refresh after approval
    } catch (error) {
      console.error("Error approving form:", error);
    } finally {
      setLoadingForms((prev) => ({ ...prev, [formId]: false })); // Re-enable button
    }
  };

  const handleDeny = async (formId) => {
    setLoadingForms((prev) => ({ ...prev, [formId]: true })); // Disable button & show spinner

    try {
      const response = await fetch(`http://localhost:3000/api/formInstance/instances/deny/${formId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to deny form ${formId}`);
      }

      fetchWorkflowData(); //Auto-refresh after denial
    } catch (error) {
      console.error("Error denying form:", error);
    } finally {
      setLoadingForms((prev) => ({ ...prev, [formId]: false })); // Re-enable button
    }
  };

  const createNewForm = () => {
    navigate(`/form/${templateId}`);
  };

  return (
    <div className="workflow-board-container">
      {loading ? (
        <p>Loading workflow board...</p>
      ) : (
        <>
          <h1>Workflow Board</h1>
          <button onClick={createNewForm} className="create-form-button">
            Create New Form
          </button>
          <div className="stages-container">
            {stages.map((stage) => (
              <div key={stage.id} className="stage-card">
                <h3>{stage.stage_name}</h3>
                <div className="form-instances-list">
                  {formInstances
                    ?.filter((form) => form.status === stage.stage_name)
                    .map((form) => (
                      <div key={form.id} className="form-instance-card">
                        <p>Form {form.id}</p>
                        <p>Status: {form.status}</p>
                        <button
                          onClick={() => navigate(`/formInstance/${form.id}`)}
                          className="view-form-button"
                        >
                          View/Edit
                        </button>                      
                        <button
                          onClick={() => handleApprove(form.id)}
                          className="approve-button"
                          disabled={loadingForms[form.id]} // Disable while processing
                        >
                          {loadingForms[form.id] ? (
                            <span className="spinner"></span> 
                          ) : (
                            "Approve"
                          )}
                        </button>                       
                        <button
                          onClick={() => handleDeny(form.id)}
                          className="deny-button"
                          disabled={loadingForms[form.id]} // Disable while processing
                        >
                          {loadingForms[form.id] ? (
                            <span className="spinner"></span> 
                          ) : (
                            "Deny"
                          )}
                        </button>
                      </div>
                    ))}
                  {formInstances?.filter((form) => form.status === stage.stage_name).length === 0 && (
                    <p>No forms in this stage.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkflowBoard;
