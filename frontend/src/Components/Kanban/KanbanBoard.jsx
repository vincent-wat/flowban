import React, { useEffect, useState } from "react";
import Stage from "./Stage";
import "./KanbanBoard.css";
import axios from "../../axios";

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

  // useStates 
  const [columns, setColumns] = useState([]);
  const[newName, setNewName] = useState('');
  const[newBoard_id, setNewBoard_id] = useState('') // need to convert to an integer 

  const [task, setTasks] = useState([]);
  const[newTitle, setNewTitle] = useState('');
  const[newDescription, setNewDescription] = useState('');
  const[newColumn_id, setNewColumn_id] = useState('');

  const [loading, setLoading] = useState(null);
  //const COLUMN_URL = "/api/columns/board/:$1";
  const COLUMN_URL = "/api/columns";
  const TASK_URL = "/api/tasks";

  /* This works by using the axios call to set response with
    the axios call. To get only the data we use the .data on reponse
    and use setColumns to set it to columns.

    Need to figure out how to add/edit/delete columns and tasks
    from the front end

    Can use a button or 

  */ 

  // fetch the Column data
  const fetchColumnData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(COLUMN_URL);
      // set the data to response
      setColumns(response.data); 
    } catch (err) {
      console.error('Error when fetching data:', err);
      
    } finally {
      setLoading(false);
    }
  };

  // fetch task data
  const fetchTaskData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(TASK_URL);
      // set the data to response
      setTasks(response.data); 
      console.log(response.data);
    } catch (err) {
      console.error('Error when fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColumnData();
  }, []); // this is here so it runs once

  useEffect(() => {
    fetchTaskData();
  }, []); 

  /* Add Column
    use the same name filed in the input when handling in the front end
    or we can use some other method but this is the basic template on 
    how to handle it
  */

  const addColumn = async () => {
    if(newName.trim() !== '' && newBoard_id.trim() !== '') {
      try {
        const newColumn = {name: newName, board_id:newBoard_id};
        const response = await axios.post(COLUMN_URL, newColumn);
        setNewName('');
        setNewBoard_id('');
        fetchColumnData();
      }catch (err) {
        console.error('Error adding a new column', err);
      }
    }
  };

  const addTask = async() => {
    if(newTitle.trim() !== '' && newDescription.trim() !== '' && newColumn_id !== '') {
      try {
        const newTask = {column_id: newColumn_id, title: newTitle, description: newDescription};
        const response = await axios.post(TASK_URL, newTask);
        setNewColumn_id('');
        setNewDescription('');
        setNewTitle('');
        fetchTaskData();
      } catch (err) {
        console.error('Error adding a new task', err);
      }
    }
  };

  const editColumn = async() => {
    
  };



  if (loading) return <p>Loading... </p>

  return (
    <div className="kanban-board">
      
      <div>
      <h1>Column Data</h1>
        {columns.map((item) => (
          <div key={item.id} className="columns">
            <p>Name: {item.name}</p>
            <p>ID: {item.id}</p>
            <p>Board_ID: {item.board_id}</p>
            <br />
          </div>
         
        ))}
      </div>
      {/*Task Section*/}
      <div>
      <h1>Task Data</h1>
        {task.map((item) => (
          <div key={item.id} className="tasks">
            <p>Title: {item.title} </p>
            <p>Description: {item.description}</p>
            <br />
            </div>
        ))}
      </div>

      {/*Test for add*/}
      <div>
        <h1>Add New Column Test</h1>
        <input type="text"
        placeholder="New Column Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)} 
        />
        <input type ="number"
          placeholder="Enter Board_id"
          value={newBoard_id}
          onChange={(e) => setNewBoard_id(e.target.value)}
        />
        <button onClick={addColumn}> Add Column</button>

        <h1>Add New Task Test</h1>
        <input type="text"
        placeholder="New Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)} />
        <input type="text"
        placeholder="New Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)} />
        <input type="number"
        placeholder="New Column_id"
        value={newColumn_id}
        onChange={(e) => setNewColumn_id(e.target.value)} />
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>

  );

  // const stages = [
  //   { title: "To Do", cases: ["Case 1", "Case 2", "Case 3"] },
  //   { title: "In Progress", cases: ["Case 4", "Case 5"] },
  //   { title: "Done", cases: ["Case 6", "Case 7", "Case 8"] },
  // ];

  // return (
  //   <div className="kanban-board">
  //     {stages.map((stage, index) => (
  //       <Stage key={index} title={stage.title} cases={stage.cases} />
  //     ))}
  //   </div>
  // );

};
export default KanbanBoard;
