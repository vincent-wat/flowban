import React, { useState } from "react";
import Stage from "./Stage";
import "./KanbanBoard.css";

const KanbanBoard = () => {
  // this a single board being represented or this is for all boards?

  /* Need to get the board ID -> get all columns associated with the board
  -> get all the tasks associated from the list of all columns 
  
  columns as []: Use this for a list of columns, 
                  as it’s a straightforward array, and 
                  React can map through it to render each category.
                  This is so we can have dynamic columns
  tasks as {}: Use this for organizing tasks into columns, 
              where each column has a list of tasks. 
  

              
  */

  const [columns, setColumns] = useState([]);
  const [task, setTasks] = useState([]);

  const stages = [
    { title: "To Do", cases: ["Case 1", "Case 2", "Case 3"] },
    { title: "In Progress", cases: ["Case 4", "Case 5"] },
    { title: "Done", cases: ["Case 6", "Case 7", "Case 8"] },
  ];

  return (
    <div className="kanban-board">
      {stages.map((stage, index) => (
        <Stage key={index} title={stage.title} cases={stage.cases} />
      ))}
    </div>
  );
};
export default KanbanBoard;
