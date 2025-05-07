import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./WorkflowBoardPage.css";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaSearch } from "react-icons/fa";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});


const WorkflowBoard = () => {
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
  const [archiveSearchTerm, setArchiveSearchTerm] = useState("");

  const SortableStage = ({ id, stage, draggable, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({ id: id.toString() });
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

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  const getUserRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).role;
    } catch {
      return null;
    }
  };

  const fetchWorkflowData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://localhost:3000/api/workflowStages/template/${templateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setStages(Array.isArray(data) ? data : []);
    } catch {
      setStages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:3000/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  };

  const fetchFormInstances = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://localhost:3000/api/formInstance/templates/${templateId}/instances`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setFormInstances(Array.isArray(data) ? data : []);
    } catch {
      setFormInstances([]);
    }
  };

  const fetchArchivedForms = async () => {
    setLoadingArchived(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://localhost:3000/api/archivedForms/templates/${templateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setArchivedForms(Array.isArray(data) ? data : []);
    } catch {
      setArchivedForms([]);
    } finally {
      setLoadingArchived(false);
    }
  };

  const handleApprove = async (formId) => {
    setLoadingForms((p) => ({ ...p, [formId]: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://localhost:3000/api/formInstance/instances/approve/${formId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();
      await fetchFormInstances();
    } catch {
      alert("Error approving form");
    } finally {
      setLoadingForms((p) => ({ ...p, [formId]: false }));
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm("Delete this form?")) return;
    setLoadingForms((p) => ({ ...p, [formId]: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://localhost:3000/api/formInstance/instances/${formId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      await fetchFormInstances();
    } catch {
      alert("Error deleting form");
    } finally {
      setLoadingForms((p) => ({ ...p, [formId]: false }));
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
      alert("Enter a denial reason.");
      return;
    }
    setLoadingForms((p) => ({ ...p, [selectedFormId]: true }));
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `https://localhost:3000/api/formInstance/instances/deny/${selectedFormId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ denial_reason: denialReason }),
        }
      );
      await fetchFormInstances();
      closeModal();
    } catch {
      alert("Error denying form");
    } finally {
      setLoadingForms((p) => ({ ...p, [selectedFormId]: false }));
    }
  };

  const addSuggestedAssignment = async () => {
    if (!selectedStageId || !selectedUserId || !selectedFormId) return;
    try {
      const token = localStorage.getItem("token");
      await fetch("https://localhost:3000/api/formAssignment/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          form_instance_id: selectedFormId,
          stage_id: Number(selectedStageId),
          assigned_user_id: Number(selectedUserId),
          role: "approver",
        }),
      });
      await fetchFormInstances();
      setSelectedStageId("");
      setSelectedUserId("");
    } catch {
      alert("Error suggesting approver");
    }
  };

  const handleCreateStage = async () => {
    if (!newStageName || !newStageOrder) {
      alert("Provide name & order.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await fetch("https://localhost:3000/api/workflowStages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          template_id: Number(templateId),
          stage_name: newStageName,
          stage_order: Number(newStageOrder),
        }),
      });
      await fetchWorkflowData();
      setShowStageModal(false);
      setNewStageName("");
      setNewStageOrder("");
    } catch {
      alert("Error creating stage");
    }
  };

  useEffect(() => {
    fetchWorkflowData();
    fetchFormInstances();
    fetchAllUsers();
    socket.on("formUpdated", fetchFormInstances);
    return () => void socket.off("formUpdated", fetchFormInstances);
  }, [templateId]);

  useEffect(() => {
    if (activeTab === "archive") fetchArchivedForms();
  }, [activeTab]);

  const filteredArchivedForms = archivedForms.filter((form) => {
    const name = `${form.submitter?.first_name || ""} ${form.submitter?.last_name || ""}`.toLowerCase();
    return name.includes(archiveSearchTerm.toLowerCase());
  });

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="workflow-board-container">
      {loading ? (
        <p>Loading workflow board...</p>
      ) : (
        <>
          {/* Top Bar */}
          <div className="top-bar">
            <h1>Workflow Board</h1>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={() => navigate(`/form/${templateId}`)} className="create-form-button">
              Create New Form
            </button>
            {getUserRoleFromToken()?.toLowerCase() === "admin" && (
              <button className="create-form-button" onClick={() => setShowStageModal(true)}>
                + Add Stage
              </button>
            )}
          </div>

          {/* Tab Toggle */}
          <div className="tab-toggle">
            <button className={activeTab === "workflow" ? "active-tab" : ""} onClick={() => setActiveTab("workflow")}>
              Workflow
            </button>
            <button className={activeTab === "archive" ? "active-tab" : ""} onClick={() => setActiveTab("archive")}>
              Archive
            </button>
          </div>

          {/* Workflow View */}
          {activeTab === "workflow" && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;
                const oldIndex = stages.findIndex((s) => s.id.toString() === active.id);
                const newIndex = stages.findIndex((s) => s.id.toString() === over.id);
                setStages((s) => arrayMove(s, oldIndex, newIndex));
              }}
            >
              <SortableContext items={stages.map((s) => s.id.toString())} strategy={horizontalListSortingStrategy}>
                <div className="stages-container">
                  {stages.map((stage) => (
                    <SortableStage
                      key={stage.id}
                      id={stage.id}
                      stage={stage}
                      draggable={
                        getUserRoleFromToken()?.toLowerCase() === "admin" &&
                        !["Initializing", "Completed"].includes(stage.stage_name)
                      }
                    >
                      <div className="form-instances-list">
                        {formInstances
                          .filter((form) => form.status === stage.stage_name)
                          .filter((form) => {
                            const uid = getUserIdFromToken();
                            return (
                              form.assignedUsers?.some(
                                (a) => a.assignedUser?.id === uid && a.approval_status === "pending"
                              ) ||
                              form.submitted_by === uid ||
                              getUserRoleFromToken()?.toLowerCase() === "admin"
                            );
                          })
                          .map((form) => (
                            <div key={form.id} className="form-instance-card">
                              <p>Form #{form.id}</p>
                              <p>Status: {form.status}</p>
                              <button
                                onClick={() => window.open(`https://localhost:3000/${form.pdf_file_path}`, "_blank")}
                                className="view-pdf-button"
                              >
                                View PDF
                              </button>
                              {form.status === "Initializing" ? (
                                <button
                                  onClick={() => handleDelete(form.id)}
                                  className="deny-button"
                                  disabled={loadingForms[form.id]}
                                >
                                  {loadingForms[form.id] ? "..." : "Delete"}
                                </button>
                              ) : form.status !== "Completed" ? (
                                <>
                                  <button
                                    onClick={() => handleApprove(form.id)}
                                    className="approve-button"
                                    disabled={loadingForms[form.id]}
                                  >
                                    {loadingForms[form.id] ? "..." : "Approve"}
                                  </button>
                                  <button
                                    onClick={() => openDenyModal(form.id)}
                                    className="deny-button"
                                    disabled={loadingForms[form.id]}
                                  >
                                    {loadingForms[form.id] ? "..." : "Deny"}
                                  </button>
                                </>
                              ) : null}
                              {["Initializing", "Admin Approval"].includes(form.status) && (
                                <button
                                  onClick={() => {
                                    setSelectedFormId(form.id);
                                    setShowSuggestModal(true);
                                  }}
                                  className="suggest-button"
                                >
                                  + Suggest
                                </button>
                              )}
                            </div>
                          ))}
                        {!formInstances.some((f) => f.status === stage.stage_name) && (
                          <p>No forms in this stage.</p>
                        )}
                      </div>
                    </SortableStage>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Archive View */}
          {activeTab === "archive" && (
            <div className="archive-container">
              <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                  placeholder="Search by submitter name"
                  value={archiveSearchTerm}
                  onChange={(e) => setArchiveSearchTerm(e.target.value)}
                />
              </div>
              <h2>Archived Forms</h2>
              {loadingArchived ? (
                <p>Loading archived forms...</p>
              ) : filteredArchivedForms.length === 0 ? (
                <p>No archived forms match your search.</p>
              ) : (
                <div className="accordion">
                  {filteredArchivedForms.map((form) => (
                    <details key={form.id} className="accordion-item">
                      <summary>
                        Form #{form.id} — Submitted by:{" "}
                        {form.submitter?.first_name} {form.submitter?.last_name}
                      </summary>
                      <div className="accordion-content">
                        <p>
                          <strong>Created At:</strong>{" "}
                          {new Date(form.created_at).toLocaleString()}
                        </p>
                        <p>
                          <strong>Archived At:</strong>{" "}
                          {new Date(form.archived_at).toLocaleString()}
                        </p>
                        <button
                          className="view-pdf-button"
                          onClick={() =>
                            window.open(
                              `https://localhost:3000${form.pdf_file_path}`,
                              "_blank"
                            )
                          }
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

          {/* Deny Modal */}
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Deny Form</h3>
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

          {/* Suggest Modal */}
          {showSuggestModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Suggest Approver</h3>
                <select value={selectedStageId} onChange={(e) => setSelectedStageId(e.target.value)}>
                  <option value="">Select Stage</option>
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.stage_name}
                    </option>
                  ))}
                </select>
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name}
                    </option>
                  ))}
                </select>
                <button onClick={addSuggestedAssignment} className="confirm-button">
                  + Add Assignment
                </button>
                <div className="suggested-list">
                  <h4>Suggested Assignments</h4>
                  <ul>
                    {suggestedAssignments.map((a, i) => (
                      <li key={i}>
                        Stage {a.stage_id}, User {a.assigned_user_id}
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

          {/* Add Stage Modal */}
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
                <select value={newStageOrder} onChange={(e) => setNewStageOrder(e.target.value)}>
                  <option value="">Select Order</option>
                  {Array.from({ length: stages.length }, (_, i) => i + 1).map((order) => (
                    <option key={order} value={order}>
                      Position {order}
                    </option>
                  ))}
                </select>
                <div className="modal-buttons">
                  <button onClick={handleCreateStage} className="confirm-button">
                    Create Stage
                  </button>
                  <button onClick={() => setShowStageModal(false)} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkflowBoard;
