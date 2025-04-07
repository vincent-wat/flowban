import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import Board from "./Components/Board";

const KanbanBoard = () => {
  const [user_id, setUser_id] = useState("");
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch("https://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUser_id(data.id);
        console.log("user_id:", user_id);
      } catch (error) {
        console.error("Error fetching user id:", error);
      }
    };
    fetchUserId();
  }, []);

  const { board_id } = useParams();
  return <Board board_id={board_id} user_id={user_id} />;
};
export default KanbanBoard;
