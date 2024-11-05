import "./Dashboard.css";
import { FaSearch } from "react-icons/fa";
import React, { useEffect, useState } from 'react';

export const Dashboard = () => {
  const [boards, setBoards] = useState([]);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await fetch('/api/boards');
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
            <button class="doc-button">Document 1</button>
            <button class="doc-button">Document 2</button>
            <button class="doc-button">Document 3</button>
            <button class="doc-button">Document 4</button>
        </div>
    </div>
  )
}

export default Dashboard;
