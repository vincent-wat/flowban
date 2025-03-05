import React from 'react';
import { useParams } from 'react-router-dom';
import Board from './Components/Board';

const KanbanBoard = () => {
  const { board_id } = useParams();
  return <Board board_id={board_id} />;   
};
export default KanbanBoard;
