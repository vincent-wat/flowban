import { FaSearch, FaRegFileAlt, FaEllipsisV, FaPlus } from "react-icons/fa";
import "./Dashboard.css";
import React, { useEffect, useState } from 'react';

export const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [newBoardName, setNewBoardName] = useState(""); 

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/boards');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoards();
  }, []);

  // Filter boards based on the search term
  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.id - a.id); // Sorts by highest to lowest id

  const handleCreateNewBoard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newBoardName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newBoard = await response.json();
      setBoards(prevBoards => [newBoard, ...prevBoards]);
      setIsModalOpen(false); 
      setNewBoardName(""); 
    } catch (error) {
      console.error('Error creating new board:', error);
    }
  };


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewBoardName(""); 
  };

  return (
    <div className="container">
      <div className="template-section">
        <div className="template-card new-board" onClick={handleOpenModal}>
          <FaPlus className="template-icon" />
          <span>New Board</span>
        </div>
        <div className="template-card" onClick={() => console.log('Using Pre-Defined Template')}>
          <FaRegFileAlt className="template-icon" />
          <span>Template 1</span>
        </div>
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
              <button onClick={handleCreateNewBoard} disabled={!newBoardName}>Create</button>
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
            <button key={board.id} className="doc-button">
              <FaRegFileAlt style={{ marginRight: "10px", color: "#C51D34" }} />
              <span className="board-name">{board.name}</span>
              <FaEllipsisV className="ellipsis-icon" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
