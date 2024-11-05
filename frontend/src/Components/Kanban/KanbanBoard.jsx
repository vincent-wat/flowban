import React from 'react';
import Stage from './Stage';
import './KanbanBoard.css';     

const KanbanBoard = () => {
  const stages = [
    { title: 'To Do', cases: ['Case 1', 'Case 2', 'Case 3'] },
    { title: 'In Progress', cases: ['Case 4', 'Case 5'] },
    { title: 'Done', cases: ['Case 6', 'Case 7', 'Case 8'] },
  ];

  return (
    <div className="kanban-board">
      {stages.map((stage, index) => (
        <Stage key={index} title={stage.title} cases={stage.cases} />
      ))}
    </div>
  );
}

export default KanbanBoard;
