import React from "react";
import "../CSS/Column.css";

import { useDroppable } from "@dnd-kit/core";
import {Task} from "./Task";

export const Column = ({tasks, column}) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="column">
      <h3>{column.title}</h3>
      <div ref={setNodeRef} className="task-list">
          {tasks.map((task) => (
            <Task task={task} />
          ))}
      </div>
    </div>
  );
};
