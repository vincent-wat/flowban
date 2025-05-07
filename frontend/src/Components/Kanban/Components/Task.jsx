import React, { useState, useEffect } from "react";
import "../CSS/Task.css";
import axios from "../../../axios";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Modal from "./Modal";
import {
  FaDotCircle,
  FaEdit,
  FaTrash,
  FaGripLines,
  FaUser,
} from "react-icons/fa";
import { use } from "react";

export const Task = ({
  task,
  editTask,
  deleteTask,
  orgUsers,
  assignTaskToUser,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);
  const [newColumn, setNewColumn] = useState(task.column_id);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [organizationUsers, setOrganizationUsers] = useState(orgUsers);

  const [assignedUser, setAssignedUser] = useState(null);
  const [hoverOverUser, setHoverOverUser] = useState(false);

  // check if the task is assigend to a user or not.

  const handleEditTask = () => {
    editTask(task.id, newTitle, newDescription);
    setIsEditModalOpen(false);
  };

  const handleAssignTask = () => {
    // get user id from email
    const user = organizationUsers.find((user) => user.email === email);
    // check if user exists
    if (user) {
      assignTaskToUser(task.id, user.id);
      setAssignedUser(user);
      setEmail("");
      setFilteredUsers([]);
      setIsAssignModalOpen(false);
    } else {
      alert("User not found");
    }
  };

  //function to handle autocomplete for the email.
  const handleEmailChange = (e) => {
    const input = e.target.value;
    setEmail(input);
    if (input.length > 0) {
      const filteredUsers = organizationUsers.filter((user) =>
        user.email.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredUsers(filteredUsers);
    } else {
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    const fetchAssignedUser = async () => {
      try {
        const response = await axios.get(
          `/api/userTasks/assigned/user/${task.id}`
        );
        console.log("Assigned User Response:", response.data);
        const userId = orgUsers.find(
          (user) => user.id === response.data.user_id
        );
        setAssignedUser(userId);
      } catch (error) {
        console.error("Error fetching assigned user:", error);
      }
    };

    fetchAssignedUser();
  }, [task.id]);

  return (
    <div style={style} ref={setNodeRef} className="task">
      <div className="drag-handle" {...listeners} {...attributes}>
        <span>
          {" "}
          <FaGripLines>Drag</FaGripLines>{" "}
        </span>{" "}
        {/* Hand icon indicating the drag handle */}
      </div>
      <div className="task-content">
        <p className="task-title">{task.title}</p>
        <p className="task-description">{task.description}</p>
      </div>
      <footer className="actions">
        <button
          className="edit-task"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditModalOpen(true);
          }}
        >
          <FaEdit size="15">Edit</FaEdit>
        </button>
        <button
          className="delete-task"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteTask(task.id);
          }}
        >
          <FaTrash size="15">Delete</FaTrash>
        </button>
        <button
          className="assign-task"
          onMouseEnter={() => setHoverOverUser(true)}
          onMouseLeave={() => setHoverOverUser(false)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsAssignModalOpen(true);
          }}
        >
          <FaUser size="15">Assign</FaUser>
        </button>
        {assignedUser && hoverOverUser && (
          <div className="assigned-user-tooltip">
            <p>Assigned to: {assignedUser.email}</p>
          </div>
        )}
      </footer>

      <Modal
        className="task-modal"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Task Title"
        />
        <textarea
          type="text"
          className="task-textarea"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Task Description "
        />
        <button onClick={handleEditTask}>Save</button>
      </Modal>

      {/*modal for assign task to user*/}
      <Modal
        className="task-modal"
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      >
        <input
          type="text"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter Email"
        ></input>
        {/* Display autocomplete suggestions */}
        {filteredUsers.length > 0 && (
          <ul className="autocomplete-list">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => {
                  setEmail(user.email); // Set the selected email
                  setFilteredUsers([]); // Clear suggestions
                }}
              >
                {user.email}
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleAssignTask}>Assign</button>
      </Modal>
    </div>
  );
};
