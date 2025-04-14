import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../../axios";
import { useParams } from "react-router-dom";
import Board from "./Components/Board";

const KanbanBoard = () => {
  const [user_id, setUser_id] = useState("");
  const [user_role, setUser_role] = useState("");
  const { board_id } = useParams();
  // Decode the token to get user ID

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
    const fetchUserRole = async () => {
      try {
        const user = jwtDecode(token);

        const response = await axios.get(
          `/api/userBoards/role/${user.id}/${board_id}`
        );
        setUser_role(response.data);
        console.log("User role:", response.data);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  return <Board board_id={board_id} user_id={user_id} user_role={user_role} />;
};
export default KanbanBoard;
