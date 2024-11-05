import "./Dashboard.css";
import React from 'react'
import { FaSearch } from "react-icons/fa";

export const Dashboard = () => {
  return (
    <>
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
    </>
  )
}

export default Dashboard;
