import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { useParams } from "react-router-dom";
import Board from "./Components/Board";

const KanbanBoard = () => {
  const [user_id, setUser_id] = useState("");
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

  const { board_id } = useParams();
  return <Board board_id={board_id} user_id={user_id} />;
};
export default KanbanBoard;
