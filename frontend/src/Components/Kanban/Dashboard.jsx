import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaRegFileAlt,
  FaEllipsisV,
  FaPlus,
  FaUser,
  FaBuilding,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import axios from "../../axios";
import { baseUrl } from "../../../axios";

export const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [user_id, setUser_id] = useState("");
  const [isManagerView, setIsManagerView] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [hasOrganization, setHasOrganization] = useState(true);

  const navigate = useNavigate();

  // get the user_id from the local storage to only
  // show the boards that the user has access to
  // Decode token and set the user ID.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      setUser_id(decodedToken.id);

      // Check if user has an organization
      const userHasOrg = !!decodedToken.organization_id;
      setHasOrganization(userHasOrg);

      console.log("Decoded user ID:", decodedToken.id);
      console.log("User has organization:", userHasOrg);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  // Fetch boards from the API.
  const fetchBoards = async () => {
    try {
      const response = await axios.get(`/api/userBoards/boards/all/${user_id}`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  // Fetch templates from the API.
  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/forms/templates/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // const response = await fetch(
      //   "https://localhost:3000/api/forms/templates",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  // When user_id is available, fetch boards and templates.
  useEffect(() => {
    if (user_id) {
      fetchBoards();
      fetchTemplates();
    }
  }, [user_id]);

  // Filter and sort boards for display.
  const filteredBoards = boards
    .filter((board) =>
      board.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.id - a.id);

  // Create a new Kanban board.
  const handleCreateNewBoard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.id;

      const board = {
        name: newBoardName,
        user_id: user_id,
      };
      const response = await axios.post(`/api/userBoards/boards`, board);

      // const response = await fetch("https://localhost:3000/api/boards", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name: newBoardName, user_id }),
      // });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newBoard = await response.json();
      setBoards((prevBoards) => [newBoard, ...prevBoards]);
      setIsModalOpen(false);
      setNewBoardName("");
    } catch (error) {
      console.error("Error creating new board:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewBoardName("");
  };

  const handleBoardClick = (boardId) => {
    navigate(`/kanban/${boardId}`);
  };
  const handleTemplateClick = (templateId) => {
    navigate(`/workflowBoard/${templateId}`);
  };

  return (
    <>
      <div className="btn-container">
        <button
          className="fixed-create-board"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="fixed-plus-icon" />
          <span>
            Create New <br />
            Kanban Board
          </span>
        </button>
        {!hasOrganization && (
          <button
            className="fixed-create-organization"
            onClick={() => navigate("/profile/organization")}
          >
            <FaBuilding className="fixed-org-icon" />
            <span>
              Create an <br />
              Organization
            </span>
          </button>
        )}
      </div>

      <div
        className="view-toggle"
        onClick={() => setIsManagerView(!isManagerView)}
      >
        <div className={`toggle-slider ${isManagerView ? "manager" : "user"}`}>
          <FaUser className="toggle-icon" />
          <span className="toggle-label">
            {isManagerView ? "Manager View" : "User View"}
          </span>
        </div>
      </div>

      <div className="container">
        <div className="template-section">
          {isManagerView && (
            <div
              className="template-card new-board"
              onClick={() => setIsTemplateModalOpen(true)}
            >
              <FaPlus className="template-icon" />
              <span>New Workflow</span>
            </div>
          )}
          {templates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => handleTemplateClick(template.id)}
            >
              <FaRegFileAlt className="template-icon" />
              <span>{template.name}</span>
            </div>
          ))}
        </div>

        {/* Modal: Regular Kanban Board */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Create New Board</h2>
              <input
                type="text"
                placeholder="Enter board name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
              <div className="modal-buttons">
                <button onClick={handleCreateNewBoard} disabled={!newBoardName}>
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewBoardName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Workflow Template Board */}
        {isTemplateModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Create New Workflow Board</h2>
              <input
                type="text"
                placeholder="Board name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
              />
              <div className="modal-buttons">
                <button
                  onClick={async () => {
                    try {
                      if (
                        !newBoardName ||
                        !description ||
                        !pdfFile ||
                        !user_id
                      ) {
                        alert(
                          "Please fill out all fields and wait for user ID to load."
                        );
                        return;
                      }

                      const formData = new FormData();
                      formData.append("name", `${newBoardName} Template`);
                      formData.append("description", description);
                      formData.append("created_by", user_id); // Placeholder until user_id works
                      // formData.append("created_by", user_id); // Use this when user_id is available
                      formData.append("file", pdfFile);
                      const templateRes = await fetch(
                        `${baseUrl}/api/forms/templates`,
                        {
                          method: "POST",
                          body: formData,
                        }
                      );

                      if (!templateRes.ok) {
                        throw new Error(
                          `Template upload failed. Status: ${templateRes.status}`
                        );
                      }

                      const templateData = await templateRes.json();
                      console.log("Uploaded template:", templateData);
                      const templateId = templateData?.template?.id;

                      if (!templateId) {
                        throw new Error("No template ID returned from upload.");
                      }

                      const boardRes = await fetch(
                        `${baseUrl}/api/workflowBoards`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name: newBoardName,
                            description,
                            created_by: user_id,
                            template_id: templateId,
                          }),
                        }
                      );

                      if (!boardRes.ok) {
                        throw new Error(
                          `Board creation failed. Status: ${boardRes.status}`
                        );
                      }

                      const newBoard = await boardRes.json();
                      setBoards((prevBoards) => [
                        newBoard.board,
                        ...prevBoards,
                      ]);
                      setIsTemplateModalOpen(false);
                      setNewBoardName("");
                      setDescription("");
                      setPdfFile(null);
                    } catch (error) {
                      console.error("Error during workflow creation:", error);
                      alert(
                        "Something went wrong — check console for details."
                      );
                    }
                  }}
                  disabled={
                    !newBoardName || !description || !pdfFile || !user_id
                  }
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsTemplateModalOpen(false);
                    setNewBoardName("");
                    setDescription("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="input-wrapper">
          <FaSearch id="search-icon" />
          <input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="board-row">
          {filteredBoards.length === 0 ? (
            <p>No boards match your search.</p>
          ) : (
            filteredBoards.map((board) => (
              <button
                key={board.id}
                className="doc-button"
                onClick={() => handleBoardClick(board.id)}
              >
                <FaRegFileAlt
                  style={{ marginRight: "10px", color: "#C51D34" }}
                />
                <span className="board-name">{board.name}</span>
                <FaEllipsisV className="ellipsis-icon" />
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
