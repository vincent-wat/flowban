import { FaSearch, FaRegFileAlt, FaEllipsisV } from "react-icons/fa";
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
  );

  return (
    <div className="container">
      <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input
          placeholder="Search"
          value={searchTerm} // Bind input to search term state
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
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
