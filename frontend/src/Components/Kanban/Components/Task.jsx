import React, { useState } from "react";
import "../CSS/Task.css";

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

export const Task = ({
  task,
  editTask,
  deleteTask,
  fetchUsersInOrganization,
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

  const handleEditTask = () => {
    editTask(task.id, newTitle, newDescription);
    setIsEditModalOpen(false);
  };

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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsAssignModalOpen(true);
          }}
        >
          <FaUser size="15">Assign</FaUser>
        </button>
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
        <input type="text" placeholder="Enter Email"></input>
        <button>Assign</button>
      </Modal>
    </div>
  );
};
