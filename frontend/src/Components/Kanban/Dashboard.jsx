import "./Dashboard.css";
import React from 'react'
import { FaSearch } from "react-icons/fa";

export const Dashboard = () => {
  return (
    <div className="input-wrapper">
        <FaSearch id="search-icon"/>
        <input placeholder="Search"/>
    </div>
  )
}

export default Dashboard;
