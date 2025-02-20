import React, { useEffect, useState } from "react";
import "../CSS/Board.css";
import { DndContext, closestCorners} from "@dnd-kit/core";
import {Column} from "./Column";
import axios from "../../../axios";
import { useParams } from "react-router-dom";



export default function Board({board_id}) {

    console.log(board_id);
   // fetch task data
 
   
   

    // column data: here now just to test
     const [columns, setColumns] = useState([]);
     const [tasks, setTasks] = useState([]); 
     const [newName, setNewName] = useState('');
     const [loading, setLoading] = useState(true);

    // url for columns and tasks
    const COLUMN_URL = "/api/columns";
    const TASK_URL = "/api/tasks"; 
    const BOARD_URL = "/api/boards";

    // Fetch board data including columns and tasks
    useEffect(() => {
      const fetchBoardData = async () => {
        try {
          const response = await axios.get(BOARD_URL + `/${board_id}`);
          const boardData = response.data;
          console.log(boardData);
        } catch (err) {
          console.error('Error when fetching board data:', err);
        } finally {
          setLoading(false);
        }
      };
  
      if (board_id) {
        fetchBoardData();
      }
    }, [board_id]);




    useEffect(() => {
        const fetchColumnData = async () => {
          try {
            setLoading(true);
            const response = await axios.get(COLUMN_URL + "/board/" + board_id);
            const columnData = response.data;
            // set the data to response
            console.log(columnData);
            setColumns(columnData);
          } catch (err) {
            console.error('Error when fetching data:', err);
            
          } finally {
            setLoading(false);
          }
        };
      if(board_id) {
        fetchColumnData();
      }
    }, [columns]);

    useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(TASK_URL + "/column_id/" + board_id);
        // set the data to response
        console.log(response.data);
        setTasks(response.data); 
      } catch (err) {
        console.error('Error when fetching data:', err);
        
      } finally {
        setLoading(false);
      }
    };
    if(board_id) {
      fetchTaskData();
    }
  }, [tasks]);

    // function to handle the drag and drop of tasks
    // need to update DB still with new values
    const handleDragEnd = (event) => {
        const {active, over} = event;
        if (!over) return;
        
        const taskID = active.id;
        const newStatus = over.id;

        setTasks((tasks) =>
          tasks.map((task) =>
            task.id === taskID
              ? { ...task, status: newStatus }
              : task
          )
        );
      };

      async function addColumn() {
        if (!board_id) {
          console.error('No board ID provided');
          return;
        }

        const newColumn = { name: newName, board_id: {board_id} };
        try {
          const response = await axios.post(COLUMN_URL, newColumn);
          console.log(response.data);
          setNewName('');
          setColumns([...columns, newColumn]);
        } catch (error) {
          console.error('Error adding column:', error);
        }
        
        }; 

    return (
        <div className="board">
          <div>
          <h1>Board ID: {board_id} </h1>
          <br/>
          </div>
        <DndContext onDragEnd={handleDragEnd}>
            {columns.map((column) => {
                const columnTasks = tasks.filter((task) => task.status === column.id);
                return (
                    <Column
                        key={column.id}
                        id={column.id}
                        column = {column}
                        tasks={columnTasks}
                    />
                );
            })}
        </DndContext>
        <div>
        <h1>Add New Column Test</h1>
        <input type="text"
        placeholder="New Column Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)} 
        />
        <button onClick={addColumn}>Add Column</button>
        </div>
        </div>
    );
    }
