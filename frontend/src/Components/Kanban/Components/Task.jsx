import React from "react";
import "../CSS/Task.css";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";


export const Task = ({task}) => {
    const { attributes, listeners, 
        setNodeRef, transform,} = useDraggable({id: task.id});
    
    const style = {
        transform: CSS.Transform.toString(transform),
    };

    return (
    <div style={style} ref = {setNodeRef} {...attributes} {...listeners} className="task">
        <input type="checkbox" className="checkbox"/>
        <p>{task.title}</p>
        <p>{task.description}</p>
    </div>
    );
};
