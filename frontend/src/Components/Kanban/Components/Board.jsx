import React, { useEffect, useState } from "react";
import "../CSS/Board.css";
import { DndContext, closestCorners} from "@dnd-kit/core";
import {Column} from "./Column";


export default function Board() {


    const [tasks, setTasks] = useState([
        {id: "1", title: "Clean Room"},
        {id: "2", title: "DO HW"},
        {id: "3", title: "Study For Test"},
    ]);

    const getTaskPos = id => tasks.findIndex(task => task.id === id);

    const arrayMove = (array, from, to) => {
        const newArray = array.slice();
        const [movedItem] = newArray.splice(from, 1);
        newArray.splice(to, 0, movedItem);
        return newArray;
    };
    const handleDragEnd = (event) => {
        const {active, over} = event;

        setTasks((tasks) => {
            const originalPos = getTaskPos(active.id);
            const newPos = getTaskPos(over.id);

            return arrayMove(tasks, originalPos, newPos);
        });
    };

    return (
        <div className="board">
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <h2 style = {{textAlign: "center"}}>Kanban Board</h2>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
                <Column id="todo" tasks={tasks}/> 
                
            </div>
        </DndContext>
        </div>
    );
    }
