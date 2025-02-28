import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./WorkflowBoardPage.css";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
});

export const WorkflowBoard = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [stages, setStages] = useState([]);
  const [formInstances, setFormInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForms, setLoadingForms] = useState({}); // Track loading state for each form
  const [showModal, setShowModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [denialReason, setDenialReason] = useState("");

  // Function to fetch workflow data
  const fetchWorkflowData = async () => {
    try {
      console.log(templateId);
      const stagesResponse = await fetch(
        `http://localhost:3000/api/workflowStages/template/${templateId}`
      );
      const stagesData = await stagesResponse.json();
  
      console.log("Fetched stages:", stagesData); // Debugging log
  
      if (!Array.isArray(stagesData)) {
        console.error("Error: Stages data is not an array!", stagesData);
        setStages([]); // Prevents breaking .map()
      } else {
        setStages(stagesData);
      }
  
    } catch (error) {
      console.error("Error fetching stages:", error);
      setStages([]); // Ensures `stages` is never undefined
    } finally {
      setLoading(false);
    }
  };
  
    

  useEffect(() => {
    fetchWorkflowData();

    // Set up WebSocket listener inside useEffect
    const handleFormUpdate = ({ id, newStatus }) => {
      console.log(`Received WebSocket update: Form ${id} -> ${newStatus}`);
      fetchWorkflowData(); 
    };

    socket.on("formUpdated", handleFormUpdate);

    return () => {
      socket.off("formUpdated", handleFormUpdate);
    };
  }, [templateId]);

  // Handle approving a form
  const handleApprove = async (formId) => {
    setLoadingForms((prev) => ({ ...prev, [formId]: true }));

    try {
      const response = await fetch(
        `http://localhost:3000/api/formInstance/instances/approve/${formId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error(`Failed to approve form ${formId}`);
      }

      fetchWorkflowData();
    } catch (error) {
      console.error("Error approving form:", error);
    } finally {
      setLoadingForms((prev) => ({ ...prev, [formId]: false }));
    }
  };

  // Open modal for denying a form
  const openDenyModal = (formId) => {
    setSelectedFormId(formId);
    setDenialReason(""); // Reset reason field
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedFormId(null);
    setDenialReason("");
  };

  // Handle denying a form
  const confirmDeny = async () => {
    if (!denialReason.trim()) {
      alert("Please enter a denial reason.");
      return;
    }

    setLoadingForms((prev) => ({ ...prev, [selectedFormId]: true }));

    try {
      const response = await fetch(
        `http://localhost:3000/api/formInstance/instances/deny/${selectedFormId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ denial_reason: denialReason }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to deny form ${selectedFormId}`);
      }

      fetchWorkflowData();
      closeModal();
    } catch (error) {
      console.error("Error denying form:", error);
      alert("Failed to deny the form.");
    } finally {
      setLoadingForms((prev) => ({ ...prev, [selectedFormId]: false }));
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
                {Array.isArray(formInstances) &&
                  formInstances.filter((form) => form.status === stage.stage_name)
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
                          disabled={loadingForms[form.id]}
                        >
                          {loadingForms[form.id] ? <span className="spinner"></span> : "Approve"}
                        </button>
                        <button
                          onClick={() => openDenyModal(form.id)}
                          className="deny-button"
                          disabled={loadingForms[form.id]}
                        >
                          {loadingForms[form.id] ? <span className="spinner"></span> : "Deny"}
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

      {/* Denial Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Deny Form</h3>
            <p>Please provide a reason for denial:</p>
            <textarea
              value={denialReason}
              onChange={(e) => setDenialReason(e.target.value)}
              placeholder="Enter denial reason..."
            />
            <div className="modal-buttons">
              <button onClick={confirmDeny} className="confirm-button">
                Confirm Deny
              </button>
              <button onClick={closeModal} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBoard;
