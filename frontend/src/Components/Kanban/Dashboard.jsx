import { FaSearch, FaRegFileAlt, FaEllipsisV, FaPlus } from "react-icons/fa";
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
  const [user_id, setUser_id] = useState("");
  const navigate = useNavigate();

  // get the user_id from the local storage to only
  // show the boards that the user has access to
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("boards:", data);
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchBoards();
    fetchTemplates();
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newBoardName,
        }),
      });

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
       <button className="fixed-create-board" onClick={() => setIsModalOpen(true)}>
        <FaPlus className="fixed-plus-icon" />
        Create New Kanban Board
      </button>
    </div>
    <div className="container">

      <div className="template-section">
        <div className="template-card new-board" onClick={handleOpenModal}>
          <FaPlus className="template-icon" />
          <span>New Board</span>
        </div>
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
              <button onClick={handleCloseModal}>Cancel</button>
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
              <FaRegFileAlt style={{ marginRight: "10px", color: "#C51D34" }} />
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
