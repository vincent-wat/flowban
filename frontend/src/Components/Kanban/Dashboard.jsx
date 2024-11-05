import "./Dashboard.css";
import { FaSearch } from "react-icons/fa";
import React, { useEffect, useState } from 'react';

export const Dashboard = () => {
  const [board, setBoard] = useState([]);
  const id = 1; 
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await fetch(`/api/boards/${id}`);
                if (!response.ok) { // Check for response status
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
                const data = await response.json();
                setBoard(data);
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
           {board ? (
                <button key={board.id} className="doc-button">{board.name}</button> // Display the specific board
            ) : (
                <p>No board found with the specified ID.</p>
            )}
        </div>
    </div>
  )
}

export default Dashboard;
