import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./WorkflowBoardPage.css";

const socket = io("https://localhost:3000", {
  transports: ["websocket", "polling"],
});

export const WorkflowBoard = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [stages, setStages] = useState([]);
  const [formInstances, setFormInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForms, setLoadingForms] = useState({});
  
  const [showModal, setShowModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [denialReason, setDenialReason] = useState("");

  const fetchWorkflowData = async () => {
    try {
      const stagesResponse = await fetch(
        `https://localhost:3000/api/workflowStages/template/${templateId}`
      );
      const stagesData = await stagesResponse.json();

      if (!Array.isArray(stagesData)) {
        console.error("Error: Stages data is not an array!", stagesData);
        setStages([]);
      } else {
        setStages(stagesData);
      }
    } catch (error) {
      console.error("Error fetching stages:", error);
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormInstances = async () => {
    try {
      const res = await fetch(
        `https://localhost:3000/api/formInstance/instances/${templateId}`
      );
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        console.error("Error: form instances is not an array!", data);
        setFormInstances([]);
      } else {
        setFormInstances(data);
      }
    } catch (error) {
      console.error("Error fetching form instances:", error);
      setFormInstances([]);
    }
  };

  useEffect(() => {
    fetchWorkflowData();
    fetchFormInstances();

    // WebSocket listener
    const handleFormUpdate = ({ id, newStatus }) => {
      console.log(`Received WebSocket update: Form ${id} -> ${newStatus}`);
      fetchWorkflowData();
      fetchFormInstances();
    };

    socket.on("formUpdated", handleFormUpdate);

    return () => {
      socket.off("formUpdated", handleFormUpdate);
    };
  }, [templateId]);

  const createNewForm = () => {
    navigate(`/form/${templateId}`);
  };

  const handleApprove = async (formId) => {
    setLoadingForms((prev) => ({ ...prev, [formId]: true }));
    try {
      const response = await fetch(
        `https://localhost:3000/api/formInstance/instances/approve/${formId}`,
        { method: "POST" }
      );
      if (!response.ok) {
        throw new Error(`Failed to approve form ${formId}`);
      }
      fetchFormInstances();
    } catch (error) {
      console.error("Error approving form:", error);
    } finally {
      setLoadingForms((prev) => ({ ...prev, [formId]: false }));
    }
  };

  const openDenyModal = (formId) => {
    setSelectedFormId(formId);
    setDenialReason("");
    setShowModal(true);
  };

  // Close denial modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedFormId(null);
    setDenialReason("");
  };

  const confirmDeny = async () => {
    if (!denialReason.trim()) {
      alert("Please enter a denial reason.");
      return;
    }
    setLoadingForms((prev) => ({ ...prev, [selectedFormId]: true }));

    try {
      const response = await fetch(
        `https://localhost:3000/api/formInstance/instances/deny/${selectedFormId}`,
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
      fetchFormInstances();
      closeModal();
    } catch (error) {
      console.error("Error denying form:", error);
      alert("Failed to deny the form.");
    } finally {
      setLoadingForms((prev) => ({ ...prev, [selectedFormId]: false }));
    }
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
                    formInstances
                      .filter((form) => form.status === stage.stage_name)
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
                            {loadingForms[form.id] ? (
                              <span className="spinner"></span>
                            ) : (
                              "Approve"
                            )}
                          </button>
                          <button
                            onClick={() => openDenyModal(form.id)}
                            className="deny-button"
                            disabled={loadingForms[form.id]}
                          >
                            {loadingForms[form.id] ? (
                              <span className="spinner"></span>
                            ) : (
                              "Deny"
                            )}
                          </button>
                        </div>
                      ))}

                  {/* If no form matches this stage */}
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
