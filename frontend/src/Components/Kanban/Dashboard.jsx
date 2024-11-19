import { FaSearch, FaRegFileAlt, FaEllipsisV, FaPlus } from "react-icons/fa";
import "./Dashboard.css";
import React, { useEffect, useState } from 'react';

export const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 

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


  return (
    <div className="container">
      {/* Create New Board Button */}
      <div className="plus-wrapper">
        <button
          className="plus-button"
        >
         <FaPlus className="plus-icon" />
          <span>New Board</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input
          placeholder="Search"
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Boards */}
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
