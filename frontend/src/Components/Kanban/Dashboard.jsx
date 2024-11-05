import "./Dashboard.css";
import { FaSearch } from "react-icons/fa";
import React, { useEffect, useState } from 'react';

export const Dashboard = () => {
  const [boards, setBoards] = useState([]);

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

  return (
    <div className="container">
      <div className="input-wrapper">
        <FaSearch id="search-icon"/>
        <input placeholder="Search"/>
      </div>
      <div className="board-row">
        {boards.length === 0 ? (
          <p>No boards available.</p>
        ) : (
          boards.map((board) => (
            <button key={board.id} className="doc-button">{board.name}</button>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
