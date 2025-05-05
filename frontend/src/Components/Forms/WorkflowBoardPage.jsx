import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./WorkflowBoardPage.css";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const socket = io("https://localhost:3000", {
  transports: ["websocket", "polling"],
});

export const WorkflowBoard = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [stages, setStages] = useState([]);
  const [users, setUsers] = useState([]);
  const [formInstances, setFormInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForms, setLoadingForms] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [denialReason, setDenialReason] = useState("");
  const [adminView, setAdminView] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [suggestedAssignments, setSuggestedAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("workflow"); 
  const [archivedForms, setArchivedForms] = useState([]);
  const [loadingArchived, setLoadingArchived] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [newStageOrder, setNewStageOrder] = useState("");
  

  const SortableStage = ({ id, stage, draggable, children }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id.toString() }); 
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      cursor: draggable ? "grab" : "not-allowed",
    };
  
    return (
      <div
        ref={setNodeRef} 
        {...(draggable ? listeners : {})}
        {...(draggable ? attributes : {})}
        className={`stage-card ${!draggable ? "locked-stage" : ""}`}
        style={style}
      >
        <h3>{stage.stage_name}</h3>
        {children}
      </div>
    );
  };
  


  const fetchWorkflowData = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const stagesResponse = await fetch(
        `https://localhost:3000/api/workflowStages/template/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
  

  function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      return payload.id; 
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }
  
  function getUserRoleFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  }  

  const handleCreateStage = async () => {
    if (!newStageName || !newStageOrder) {
      alert("Please provide both a stage name and order.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:3000/api/workflowStages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template_id: parseInt(templateId),
          stage_name: newStageName,
          stage_order: parseInt(newStageOrder),
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create stage: ${errorText}`);
      }
  
      await fetchWorkflowData();
      setShowStageModal(false);
      setNewStageName("");
      setNewStageOrder("");
    } catch (error) {
      console.error("Error creating stage:", error);
      alert("Failed to create stage: " + error.message);
    }
  };
  

  const isUserAssignedToForm = (form) => {
    const userId = getUserIdFromToken();
  
    const isAssigned = form.assignedUsers?.some(
      (assignment) =>
        assignment.assignedUser?.id === userId &&
        assignment.approval_status === "pending"
    );
  
    const isSubmitter = form.submitted_by === userId;
  
    const isAdmin = localStorage.getItem("role") === "admin";
  
    return isAssigned || isSubmitter || isAdmin;
  };
  
  const fetchArchivedForms = async () => {
    setLoadingArchived(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://localhost:3000/api/archivedForms/templates/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await res.json();
  
      if (Array.isArray(data)) {
        setArchivedForms(data);
      } else {
        console.error("Archived data is not an array:", data);
        setArchivedForms([]);
      }
    } catch (error) {
      console.error("Error fetching archived forms:", error);
      setArchivedForms([]);
    } finally {
      setLoadingArchived(false);
    }
  };
  
  
  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`https://localhost:3000/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("User data is not an array:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const fetchFormInstances = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("FORM INSTANCES:", formInstances);
      formInstances.forEach(form => {
      console.log(`Form ${form.id} assignedUsers:`, form.assignedUsers);
      });
      const res = await fetch(
        `https://localhost:3000/api/formInstance/templates/${templateId}/instances`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    if (activeTab === "archive") {
      fetchArchivedForms();
    }
  }, [activeTab]);
  
  useEffect(() => {
    fetchWorkflowData();
    fetchFormInstances();
    fetchAllUsers();

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

      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();
    
      const form = formInstances.find((f) => f.id === formId);
    
      const isSubmitter = form?.submitted_by === userId;
      const isAssigned = form?.assignedUsers?.some(
        (a) => a.assignedUser?.id === userId && a.approval_status === "pending"
      );
    
      const hasSuggestions = form?.assignedUsers?.some(
        (a) => a.approval_status === "suggested"
      );
    
      const suggestionPhaseStages = ["Initializing", "Admin Approval"];

      if (
        isSubmitter &&
        suggestionPhaseStages.includes(form.status) &&
        !hasSuggestions
      ) {
        alert("You must suggest at least one approver before approving this form.");
        return;
      }

    
      if (!isAssigned && !isSubmitter) {
        alert("You are not allowed to approve this form.");
        return;
      }

      const requiredStages = stages.filter(
        (stage) =>
          !["Initializing", "Admin Approval", "Completed"].includes(stage.stage_name)
      );
      
      const hasSuggestionsForAllStages = requiredStages.every((stage) =>
        form.assignedUsers?.some(
          (assignment) =>
            assignment.stage_id === stage.id && assignment.approval_status === "suggested"
        )
      );
      

      if (
        isSubmitter &&
        suggestionPhaseStages.includes(form.status) &&
        !hasSuggestionsForAllStages
      ) {
        alert("You must suggest at least one approver for each required stage before approving.");
        return;
      }
      
      
      const response = await fetch(
        `https://localhost:3000/api/formInstance/instances/approve/${formId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to approve form ${formId}: ${errorText}`);
      }
      fetchFormInstances();
    } catch (error) {
      console.error("Error approving form:", error.message);
      alert("Error approving form: " + error.message);
    } finally {
      setLoadingForms((prev) => ({ ...prev, [formId]: false }));
    }
  };

  const openDenyModal = (formId) => {
    setSelectedFormId(formId);
    setDenialReason("");
    setShowModal(true);
  };

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
  
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(); 
  
    const assignedUser = formInstances
      .find(form => form.id === selectedFormId)
      ?.assignedUsers
      ?.find(user => user.id === userId && user.approval_status === "pending");
  
    if (!assignedUser) {
      alert("You are not assigned to deny this form.");
      return;
    }
  
    setLoadingForms((prev) => ({ ...prev, [selectedFormId]: true }));
  
    try {
      const response = await fetch(
        `https://localhost:3000/api/formInstance/instances/deny/${selectedFormId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ denial_reason: denialReason }),
        }
      );
  
      const responseBody = await response.json();
  
      if (!response.ok) {
        if (response.status === 403) {
          alert("You are not assigned to deny this form."); 
        } else {
          alert(`Failed to deny form: ${responseBody.message || "Unknown error"}`);
        }
        return;
      }
  
      fetchFormInstances();
      closeModal();
  
    } catch (error) {
      console.error("Error denying form:", error);
      alert("Failed to deny the form. Please try again.");
    } finally {
      setLoadingForms((prev) => ({ ...prev, [selectedFormId]: false }));
    }
  };
  

  const addSuggestedAssignment = async () => {
    if (!selectedStageId || !selectedUserId || !selectedFormId) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://localhost:3000/api/formAssignment/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          form_instance_id: selectedFormId,
          stage_id: parseInt(selectedStageId),
          assigned_user_id: parseInt(selectedUserId),
          role: "approver",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Suggest failed: ${errorText}`);
      }

      const data = await response.json();
      console.log("Suggested assignment saved:", data.assignment);

      await fetchFormInstances(); 
      setSelectedStageId("");
      setSelectedUserId("");
    } catch (err) {
      console.error("Error suggesting approver:", err);
      alert("Error suggesting approver");
    }
  };
  console.log("Role (parsed):", getUserRoleFromToken()?.toLowerCase());

  const sensors = useSensors(
    useSensor(PointerSensor));

  return (
    <div className="workflow-board-container">
      {loading ? (
        <p>Loading workflow board...</p>
      ) : (
        <>
          <div className="top-bar">
            <h1>Workflow Board</h1>
          </div>
        
          <div className="action-buttons">
            <button onClick={createNewForm} className="create-form-button">
              Create New Form
            </button>
                
            {getUserRoleFromToken()?.toLowerCase() === "admin" && (
              <button
                className="create-form-button"
                onClick={() => setShowStageModal(true)}
              >
                + Add Stage
              </button>
            )}
          </div>



          <div className="tab-toggle">
            <button
              className={activeTab === "workflow" ? "active-tab" : ""}
              onClick={() => setActiveTab("workflow")}
            >
              Workflow
            </button>
            <button
              className={activeTab === "archive" ? "active-tab" : ""}
              onClick={() => setActiveTab("archive")}
            >
              Archive
            </button>
          </div>
          {activeTab === "workflow" && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;
                const oldIndex = stages.findIndex((s) => s.id.toString() === active.id);
                const newIndex = stages.findIndex((s) => s.id.toString() === over.id);
                setStages((stages) => arrayMove(stages, oldIndex, newIndex));
              }}
            >
              <SortableContext
                items={stages.map((s) => s.id.toString())}
                strategy={horizontalListSortingStrategy}
              >
                <div className="stages-container">
                  {stages.map((stage) => (
                    <SortableStage key={stage.id}
                    id={stage.id}
                    stage={stage}
                    draggable={
                      getUserRoleFromToken()?.toLowerCase() === "admin" &&
                      !["Initializing", "Completed"].includes(stage.stage_name)
                    }>
                      <div className="form-instances-list">
                        {Array.isArray(formInstances) &&
                          formInstances
                            .filter((form) => form.status === stage.stage_name)
                            .filter((form) => isUserAssignedToForm(form))
                            .map((form) => (
                              <div key={form.id} className="form-instance-card">
                                <p>Form {form.id}</p>
                                <p>Status: {form.status}</p>
                                <button
                                  onClick={() =>
                                    window.open(`https://localhost:3000/${form.pdf_file_path}`, "_blank")
                                  }
                                  className="view-pdf-button"
                                >
                                  View PDF
                                </button>
                                {form.status !== "Completed" && (
                                  <>
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
                                  </>
                                )}
                                {["Initializing", "Admin Approval"].includes(form.status) && (
                                  <button
                                    onClick={() => {
                                      setSelectedFormId(form.id);
                                      setShowSuggestModal(true);
                                    }}
                                    className="suggest-button"
                                  >
                                    + Suggest Approver
                                  </button>
                                )}
                              </div>
                            ))}
                        {formInstances
                          .filter((form) => form.status === stage.stage_name)
                          .filter((form) => isUserAssignedToForm(form)).length === 0 && (
                          <p>No forms in this stage.</p>
                        )}
                      </div>
                    </SortableStage>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </>
      )}

      {activeTab === "archive" && (
        <div className="archive-container">
          <h2>Archived Forms</h2>
          {loadingArchived ? (
            <p>Loading archived forms...</p>
          ) : archivedForms.length === 0 ? (
            <p>No archived forms available.</p>
          ) : (
            <div className="accordion">
              {archivedForms.map((form, index) => (
                <details key={form.id} className="accordion-item">
                  <summary>
                    Form #{form.id} — Submitted by: {form.submitter?.email || "Unknown"}
                  </summary>
                  <div className="accordion-content">
                    <p><strong>Created At:</strong> {new Date(form.created_at).toLocaleString()}</p>
                    <p><strong>Archived At:</strong> {new Date(form.archived_at).toLocaleString()}</p>
                    {form.denial_reason && (
                      <p><strong>Denial Reason:</strong> {form.denial_reason}</p>
                    )}
                    <button
                      className="view-pdf-button"
                      onClick={() => window.open(`https://localhost:3000${form.pdf_file_path}`, "_blank")}
                    >
                      View PDF
                    </button>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      )}

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

      {showSuggestModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Suggest Approver</h3>
            <select value={selectedStageId} onChange={(e) => setSelectedStageId(e.target.value)}>
              <option value="">Select Stage</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>{stage.stage_name}</option>
              ))}
            </select>

            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="">Select User</option>
              {Array.isArray(users) &&
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
            </select>

            <button
              onClick={(e) => {
                e.preventDefault();
                addSuggestedAssignment();
              }}
              className="confirm-button"
            >
              + Add Assignment
            </button>

            <div className="suggested-list">
              <h4>Suggested Assignments</h4>
              <ul>
                {suggestedAssignments.map((a, idx) => (
                  <li key={idx}>
                    Stage ID: {a.stage_id}, User ID: {a.assigned_user_id}
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-buttons">
              <button onClick={() => setShowSuggestModal(false)} className="cancel-button">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showStageModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Workflow Stage</h3>
      
            <input
              type="text"
              placeholder="Stage Name"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
            />

            <select
              value={newStageOrder}
              onChange={(e) => setNewStageOrder(e.target.value)}
            >
              <option value="">Select Order</option>
              {Array.from({ length: stages.length - 1 }, (_, i) => i + 2).map((order) => (
                <option key={order} value={order}>
                  Position {order}
                </option>
              ))}
            </select>
              
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleCreateStage}>
                Create Stage
              </button>
              <button className="cancel-button" onClick={() => setShowStageModal(false)}>
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
