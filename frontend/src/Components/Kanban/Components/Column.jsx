import React, { useState } from "react";
import "../CSS/Column.css";

import { useDroppable } from "@dnd-kit/core";
import {Task} from "./Task";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import  Modal  from "./Modal";

export const Column = ({tasks, column, deleteColumn, editColumn, addTask, editTask, deleteTask, color}) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [newName, setNewName] = useState(column.name);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const handleEditColumn = () => {
    editColumn(column.id, newName);
    setIsEditModalOpen(false);
  };
  const handleNewTask = () => {
    addTask(column.id, title, description); 
    setTitle("");
    setDescription("");
    setIsAddTaskModalOpen(false);
  };

  return (
    <div className="column" style = {{backgroundColor: color}}>
      <h3>{column.name}</h3>
      <div ref={setNodeRef} className="task-list droppable-area">
          {tasks.map((task) => (
            <Task task={task} key={task.id} id = {task.id} editTask={editTask} deleteTask={deleteTask}/>
          ))}
      </div>
      <footer className="column-footer">
        <button className="add-task" onClick={() => setIsAddTaskModalOpen(column.id)}>
          <FaPlus /> Add Task
        </button>  
        <button className="edit-column" onClick= {() => setIsEditModalOpen(true)}>
          <FaEdit /> Edit Column
        </button>
        <button className="delete-column" onClick={() => deleteColumn(column.id)}>
          <FaTrash /> Delete Column
        </button>

      
      </footer>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}

            />
            <button onClick={handleEditColumn}>Save</button>
          </Modal>

      <Modal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
        />
        <button onClick={handleNewTask}>Save</button>
      </Modal>
    </div>
  );
};
