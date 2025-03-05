import React, { useEffect, useState } from "react";
import "../CSS/Board.css";
import { DndContext, closestCorners} from "@dnd-kit/core";
import {Column} from "./Column";
import axios from "../../../axios";
import { use } from "react";
import Modal from "./Modal";
import { FaPlus } from "react-icons/fa";




export default function Board({board_id}) {

    console.log("Board ID: " + board_id);

    // column data: here now just to test
     const [columns, setColumns] = useState([]);
     const [tasks, setTasks] = useState([]); 
     const [newName, setNewName] = useState('');
     const [updateColumns, setUpdateColumns] = useState(false);
     const [updateTasks, setUpdateTasks] = useState(false);
     const [activeTask, setActiveTask] = useState(null);

     const [loading, setLoading] = useState(true);

    // url for columns and tasks
    const COLUMN_URL = "/api/columns";
    const TASK_URL = "/api/tasks"; 
    const BOARD_URL = "/api/boards";

    // Fetch board data including columns and tasks
    const fetchBoardData = async () => {
        try {
          const response = await axios.get(`${BOARD_URL}/${board_id}`);
          const board = response.data;
          console.log("Board Data: ");
          console.log(board);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching board data:', error);
        }
      };
   


    // Fetch column data
    const fetchColumnData = async () => {
        try {
          const response = await axios.get(`${COLUMN_URL}/board/${board_id}`);
          const allColumns = response.data;
          console.log("Column Data: ");
          console.log(allColumns);
          setColumns(allColumns);
        } catch (error) {
          console.error('Error fetching column data:', error);
        }
      };


    
    
    // Fetch task data
    const fetchTaskData = async (columns) => {
      try {
        const tasksPromises = columns.map(column =>
          axios.get(`${TASK_URL}/column_id/${column.id}`)
        );
        const tasksResponses = await Promise.all(tasksPromises);
        const allTasks = tasksResponses.flatMap(response => response.data);
        setTasks(allTasks);
        console.log("Task Data: ");
        console.log(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };


    useEffect(() => {
      fetchColumnData();
    }, [updateColumns]);

    useEffect(() => {
      fetchTaskData(columns);
    }, [columns]);

    useEffect(() => { 
      fetchTaskData(columns);
    }
    , [updateTasks]);


    const handleDragStart = (event) => {
      const { active } = event;
      const task = tasks.find((task) => task.id === active.id);
      setActiveTask(task);
    };
    // function to handle the drag and drop of tasks
    // need to update DB still with new values
    const handleDragEnd = async (event) => {

        setActiveTask(null);

        const {active, over} = event;
        if (!over) return;
        
        const taskID = active.id;
        const newColumn = over.id;

        const updatedTasks = tasks.map((task) =>
          task.id === taskID
            ? { ...task, column_id: newColumn }
            : task
        );

        try {
          await axios.put(`${TASK_URL}/batch`, { tasks: updatedTasks });
          setTasks(updatedTasks);
        } catch (error) {
          console.error("Error updating tasks:", error);
        }
      };
      /* Coulmn functions 
      ------------------------------------------------------------*/

      // Function to add a new column
      const addColumn = async () => {
        if (!board_id) {
          console.error('No board ID provided');
          return;
        }

        const newColumn = { name: newName, board_id: board_id };

        try {
          const response = await axios.post(COLUMN_URL, newColumn);
          console.log(response.data);
          setColumns([...columns, newColumn]);
          setNewName('');
          setUpdateColumns(true);
        } catch (error) {
          console.error('Error adding column:', error);
        }
      };
      // function to delete a column
      const deleteColumn = async (column_id) => {
        try {
          deleteAllTasksForColumn(column_id); 
          await axios.delete(`${COLUMN_URL}/id/${column_id}`);
          setColumns(columns.filter((column) => column.id !== column_id));
          
          setUpdateColumns(true);
        } catch (error) {
          console.error('Error deleting column:', error);
        }
      };
      // function to edit a column name
      const editColumn = async (column_id, newName) => {
        
        try {
          await axios.put(`${COLUMN_URL}/id/${column_id}`, { name: newName });
          setColumns(
            columns.map((column) =>
              column.id === column_id ? { ...column, name: newName } : column
            )
          );
          setUpdateColumns(true);
        } catch (error) {
          console.error('Error updating column:', error);
        }
      };


      /* Task functions
      ------------------------------------------------------------*/
      // function to add a new task
      const addTask = async (column_id, newTitle, NewDescription) => {
        const newTask = { title: newTitle, description: NewDescription ,column_id: column_id };
        try {
          const response = await axios.post(TASK_URL, newTask);
          console.log(response.data);
          setTasks([...tasks, newTask]);
          setUpdateTasks(true);
        } catch (error) {
          console.error('Error adding task:', error);
        }
      };
      const deleteTask = async (task_id) => {
        try {
          await axios.delete(`${TASK_URL}/id/${task_id}`);
          setTasks(tasks.filter((task) => task.id !== task_id));
          setUpdateTasks(true);
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      };

      const editTask = async (task_id, newTitle, newDescription) => {
        
        try {
          await axios.put(`${TASK_URL}/id/${task_id}`, {
            title: newTitle,
            description: newDescription
          });
          setTasks(
            tasks.map((task) =>
              task.id === task_id
                ? { ...task, title: newTitle, description: newDescription}
                : task
            )
          );
          setUpdateTasks(true);
        } catch (error) {
          console.error('Error updating task:', error);
        }
      };

      const deleteAllTasksForColumn = async (column_id) => {
        try {
          await axios.delete(`${TASK_URL}/column_id/${column_id}`);
          setTasks(tasks.filter((task) => task.column_id !== column_id));
          setUpdateTasks(true);
        } catch (error) {
          console.error('Error deleting tasks:', error);
        }
      };


    const columnColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"];
    return (
        <div className="board">
        
        <DndContext onDragStart = {handleDragStart} onDragEnd={handleDragEnd}>
            {columns.map((column) => {
                const columnTasks = tasks.filter((task) => task.column_id === column.id);
                return (
                    <Column
                        key={column.id} id={column.id} column = {column} tasks={columnTasks}
                        deleteColumn={deleteColumn} addTask={addTask} editColumn={editColumn}
                        deleteTask={deleteTask} editTask={editTask}
                        color = {columnColors[column.id % columnColors.length]}
                    />
                );
            })}
        </DndContext>
        <div>
        <h3>Add New Column</h3>
        <input type="text"
        placeholder="New Column Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)} 
        />
        <button onClick={addColumn}><FaPlus/>Add Column</button>
        </div>
        </div>
    );
    }

