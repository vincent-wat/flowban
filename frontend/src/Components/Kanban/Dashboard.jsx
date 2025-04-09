import {
  FaSearch,
  FaRegFileAlt,
  FaEllipsisV,
  FaPlus,
  FaUser,
} from "react-icons/fa";
import "./Dashboard.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token); // Decode the token
      setUser_id(decodedToken.id); // Extract the user's ID from the token
      console.log("Decoded user ID:", decodedToken.id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch(
          `https://localhost:3000/api/userBoards/boards/all/${user_id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          "https://localhost:3000/api/forms/templates"
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    if (user_id) {
      fetchBoards();
      fetchTemplates();
    }
  }, [user_id]);

  const filteredBoards = boards
    .filter((board) =>
      board.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.id - a.id);

  const handleCreateNewBoard = async () => {
    try {
      const response = await fetch("https://localhost:3000/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBoardName }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const newBoard = await response.json();
      setBoards((prevBoards) => [newBoard, ...prevBoards]);
      setIsModalOpen(false);
      setNewBoardName("");
    } catch (error) {
      console.error("Error creating new board:", error);
    }
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
          Create New Kanban Board
        </button>
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
                      // ADD "(!newBoardName || !description || !pdfFile || !user_id)" WHEN USER_ID WORKS
                      if (!newBoardName || !description || !pdfFile) {
                        alert(
                          "Please fill out all fields and wait for user ID to load."
                        );
                        return;
                      }

                      const formData = new FormData();
                      formData.append("name", `${newBoardName} Template`);
                      formData.append("description", description);
                      formData.append("created_by", 1); // PLACEHOLDER UNTIL USER_ID WORKS
                      //formData.append("created_by", user_id);  USE THIS WHEN USER_ID WORKS
                      formData.append("file", pdfFile);

                      const templateRes = await fetch(
                        "https://localhost:3000/api/forms/templates",
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

                      // Debug log to verify template structure
                      console.log("Uploaded template:", templateData);

                      const templateId = templateData?.template?.id;

                      if (!templateId) {
                        throw new Error("No template ID returned from upload.");
                      }

                      // POST REQUEST
                      const boardRes = await fetch(
                        "https://localhost:3000/api/workflowBoards",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name: newBoardName,
                            description,
                            created_by: 1,
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

                      // Update board list and clear form
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
                  // ADD "(!newBoardName || !description || !pdfFile || !user_id)" WHEN USER_ID WORKS
                  disabled={!newBoardName || !description || !pdfFile}
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
