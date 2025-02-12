import React, { useEffect, useState } from "react";
import "../CSS/Board.css";
import { DndContext, closestCorners} from "@dnd-kit/core";
import {Column} from "./Column";
import axios from "../../../axios";

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Research Project',
    description: 'Gather requirements and create initial documentation',
    status: 'TODO',
  },
  {
    id: '2',
    title: 'Design System',
    description: 'Create component library and design tokens',
    status: 'TODO',
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Implement REST API endpoints',
    status: 'IN_PROGRESS',
  },
  {
    id: '4',
    title: 'Testing',
    description: 'Write unit tests for core functionality',
    status: 'DONE',
  },
];
export default function Board() {


   // fetch task data
 
   const [tasks, setTasks] = useState(INITIAL_TASKS); 
   

  // functionality to fetch data from the backend 
  //  const TASK_URL = "/api/tasks";
  //  const fetchTaskData = async () => {
  //    try {
  //      setLoading(true);
  //      const response = await axios.get(TASK_URL);
  //      // set the data to response
  //      setTasks(response.data); 
  //      console.log(response.data);
  //    } catch (err) {
  //      console.error('Error when fetching data:', err);
  //    } finally {
  //      setLoading(false);
  //    }
  //  };   
  //    useEffect(() => {
  //      fetchTaskData();
  //    }, []);
    // end fetch task data

    // column data: here now just to test
     const [columns, setColumns] = useState(COLUMNS);

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

    return (
        <div className="board">
        <DndContext onDragEnd={handleDragEnd}>
            {columns.map((column) => {
                const columnTasks = tasks.filter((task) => task.status === column.id);
                return (
                    <Column
                        key={column.id}
                        id={column.id}
                        column = {column}
                        title={column.title}
                        tasks={columnTasks}
                    />
                );
            })}
        </DndContext>
        </div>
    );
    }
