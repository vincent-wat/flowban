import React, { useState } from "react";
import "../CSS/Task.css";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Modal from "./Modal";
import { FaDotCircle } from "react-icons/fa";


export const Task = ({task, editTask, deleteTask}) => {
    const { attributes, listeners, 
        setNodeRef, transform,} = useDraggable({id: task.id});
    
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);   
    const [newDescription, setNewDescription] = useState(task.description);
    const [newColumn, setNewColumn] = useState(task.column_id);

    const handleEditTask = () => {
        editTask(task.id, newTitle, newDescription);
        setIsEditModalOpen(false);
    }

    return (
    <div style={style} ref={setNodeRef} className="task">
        <div className="drag-handle" {...listeners} {...attributes}>
            <span > <FaDotCircle>Drag</FaDotCircle> </span> {/* Hand icon indicating the drag handle */}
        </div>
        <div className="task-content">
        <p className="task-title">{task.title}</p>
        <p className="task-description">{task.description}</p>
      </div>
        <footer>
            <button
                className="edit-task"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                }}
            >
                Edit
            </button>
            <button
                className="delete-task"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteTask(task.id);
                }}
            >
                Delete
            </button>
        </footer>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Task Title" />
            <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Task Description" />
            <button onClick={handleEditTask}>Save</button>
        </Modal>
    </div>
    );
};
