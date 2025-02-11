import "../CSS/Column.css";

import {
    SortableContext,
    verticalListSortingStrategy,
  } from "@dnd-kit/sortable";
  
  import { Task } from "./Task";
  

  
  export const Column = ({ tasks }) => {
    return (
      <div className="column">
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Task key={task.id} id={task.id} title={task.title} />
          ))}
        </SortableContext>
      </div>
    );
  };
/*NOTES: 
    snapshot object is used to determine if the user is dragging over the droppable area
    helps with the color change when the item is dragged over the droppable area

*/