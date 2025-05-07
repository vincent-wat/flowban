import React, { useEffect, useState, useRef } from "react";
import "../CSS/Board.css";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { Column } from "./Column";
import axios from "../../../axios";
import { use } from "react";
import Modal from "./Modal";
import { FaPlus, FaBars } from "react-icons/fa";
import { io } from "socket.io-client";
import { error } from "pdf-lib";

// Initialize Socket.IO
const socket = io("https://localhost:3000", {
  transports: ["websocket", "polling"],
});

export default function Board({ board_id, user_id, user_role }) {
  console.log("Board ID: " + board_id);
  console.log("User ID: " + user_id);
  console.log("User Role: " + user_role);
  console.log("\n\n\n\n");
  const isFirstRender = useRef(true);

  // column data: here now just to test
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newName, setNewName] = useState("");
  const [updateBoard, setUpdateBoard] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isShareKanbanOpen, setIsKanbanOpen] = useState(false);
  const [invitePrivilege, setInvitePrivilege] = useState("");
  const [organizationUsers, setOrganizationUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [inviteEmail, setEmail] = useState("");
  const [inviteRole, setRole] = useState("");

  // url for columns and tasks
  const COLUMN_URL = "/api/columns";
  const TASK_URL = "/api/tasks";
  const BOARD_URL = "/api/boards";
  const USER_BOARD_URL = "api/userBoards";
  const USER_TASK_URL = "/api/userTasks";

  function checkUserRole() {
    if (user_role === "owner" || user_role === "editor") {
      return true; // User has permission to edit
    } else {
      return false; // User does not have permission to edit
    }
  }

  // Fetch board data including columns and tasks
  const fetchBoardData = async () => {
    try {
      const response = await axios.get(`${BOARD_URL}/${board_id}`);
      const board = response.data;
      console.log("Board Data: ");
      console.log(board);
    } catch (error) {
      console.error("Error fetching board data:", error);
    }
  };

  // Fetch column data
  const fetchAllData = async () => {
    console.log("Fetch Column Data triggered\n\n");
    try {
      const response = await axios.get(`${COLUMN_URL}/board/${board_id}`);

      const allColumns = response.data.sort((a, b) => a.id - b.id);

      setColumns(allColumns);
      console.log("Column Data: ");
      console.log(allColumns);

      const tasksPromises = allColumns.map((column) =>
        axios.get(`${TASK_URL}/column_id/${column.id}`)
      );
      const tasksResponses = await Promise.all(tasksPromises);
      const allTasks = tasksResponses.flatMap((response) => response.data);

      setTasks(allTasks);
      console.log("Task Data: ");
      console.log(tasks);
    } catch (error) {
      console.error("Error fetching column data:", error);
    }
  };

  // Fetch task data
  const fetchTaskData = async () => {
    console.log("Fetch Task Data triggered");
    console.log("Columns: ", columns);
    if (columns.length === 0) {
      console.log("No columns available to fetch tasks.");
      return;
    }
    try {
      const tasksPromises = columns.map((column) =>
        axios.get(`${TASK_URL}/column_id/${column.id}`)
      );
      const tasksResponses = await Promise.all(tasksPromises);
      const allTasks = tasksResponses.flatMap((response) => response.data);

      setTasks(allTasks);
      console.log("Task Data: ");
      console.log(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDragStart = (event) => {
    if (!checkUserRole()) {
      console.log("User does not have permission to drag tasks.");
      return;
    }
    const { active } = event;
    const task = tasks.find((task) => task.id === active.id);
    setActiveTask(task);
  };
  // function to handle the drag and drop of tasks
  // need to update DB still with new values
  const handleDragEnd = async (event) => {
    if (!checkUserRole()) {
      return;
    }
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const taskID = active.id;
    const newColumn = over.id;

    const updatedTasks = tasks.map((task) =>
      task.id === taskID ? { ...task, column_id: newColumn } : task
    );

    try {
      await axios.put(`${TASK_URL}/batch`, { tasks: updatedTasks });
      setUpdateBoard(true);
      //setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  };
  /* Column functions 
      ------------------------------------------------------------*/

  // Function to add a new column
  const addColumn = async () => {
    if (!checkUserRole()) {
      return;
    }
    if (!board_id) {
      console.error("No board ID provided");
      return;
    }

    const newColumn = { name: newName, board_id: board_id };

    try {
      const response = await axios.post(COLUMN_URL, newColumn);
      //console.log(response.data);
      //setColumns([...columns, newColumn]);
      setNewName("");
      setUpdateBoard(true);
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };
  // function to delete a column
  const deleteColumn = async (column_id) => {
    if (!checkUserRole()) {
      return;
    }
    try {
      deleteAllTasksForColumn(column_id);
      await axios.delete(`${COLUMN_URL}/id/${column_id}`);
      //setColumns(columns.filter((column) => column.id !== column_id));

      setUpdateBoard(true);
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };
  // function to edit a column name
  const editColumn = async (column_id, newName) => {
    try {
      await axios.put(`${COLUMN_URL}/id/${column_id}`, { name: newName });
      setUpdateBoard(true);
    } catch (error) {
      console.error("Error updating column:", error);
    }
  };

  /* Task functions
      ------------------------------------------------------------*/
  // function to add a new task
  const addTask = async (column_id, newTitle, NewDescription) => {
    if (!checkUserRole()) {
      return;
    }
    const newTask = {
      title: newTitle,
      description: NewDescription,
      column_id: column_id,
    };
    try {
      const response = await axios.post(TASK_URL, newTask);
      //console.log(response.data);
      setUpdateBoard(true);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  const deleteTask = async (task_id) => {
    if (!checkUserRole()) {
      return;
    }
    console.log("Delete Task ID: ", task_id);
    try {
      await axios.delete(`${TASK_URL}/id/${task_id}`);
      setUpdateBoard(true);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = async (task_id, newTitle, newDescription) => {
    if (!checkUserRole()) {
      return;
    }
    try {
      await axios.put(`${TASK_URL}/id/${task_id}`, {
        title: newTitle,
        description: newDescription,
      });
      // setTasks(
      //   tasks.map((task) =>
      //     task.id === task_id
      //       ? { ...task, title: newTitle, description: newDescription }
      //       : task
      //   )
      // );
      setUpdateBoard(true);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteAllTasksForColumn = async (column_id) => {
    try {
      await axios.delete(`${TASK_URL}/column_id/${column_id}`);
      setUpdateBoard(true);
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  const handleAddColumn = () => {
    console.log("handleAddColumn clicked");
    addColumn();
    setIsAddColumnOpen(false);
    //
  };
  const handleShareKanban = async () => {
    console.log("Email:", inviteEmail, "Role:", inviteRole);
    if (inviteEmail === "") return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new error("No authentication token found");
      }
      const response = await axios.post(
        `${USER_BOARD_URL}/invite`,
        { email: inviteEmail, board_id: { board_id }, role: inviteRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Invite Sent!");
      setEmail("");
      setRole("");
    } catch (error) {
      console.log("Error inviting user:", error);
    }
  };
  // get all users in the organization so we can send invites and also
  // assign tasks to users.
  const fetchUsersInOrganization = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token: ", token);
      if (!token) {
        throw new error("No authentication token found");
      }

      const response = await axios.get("/api/organizations/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.users) {
        setOrganizationUsers(response.data.users);
      }
      console.log("Users in organization:", response.data);
    } catch (error) {
      console.error("Error fetching users in organization:", error);
    }
  };

  // function to handle autocomplete for the email.
  const handleEmailChange = (e) => {
    const input = e.target.value;
    setEmail(input);
    if (input.length > 0) {
      const filteredUsers = organizationUsers.filter((user) =>
        user.email.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredUsers(filteredUsers);
    } else {
      setFilteredUsers([]);
    }
  };

  // function to assign a task to a user
  const assignTaskToUser = async (assign_task_id, assign_user_id) => {
    if (!checkUserRole()) {
      return;
    }
    const newUserTask = {
      user_id: assign_user_id,
      task_id: assign_task_id,
    };

    try {
      await axios.post(USER_TASK_URL, newUserTask);
      console.log("Task assigned to user:", assign_user_id);
      setUpdateBoard(true);
    } catch (error) {
      console.error("Error assigning task to user:", error);
    }
    // get email of user from organizationUsers
    const user = organizationUsers.find((user) => user.id === assign_user_id);
    if (user) {
      const email = user.email;
      console.log("User email:", email);
      const task = tasks.find((task) => task.id === assign_task_id);
      console.log("Task:", task);
      //send email notification to user
      await axios.post(`${USER_TASK_URL}/notification`, {
        email: email,
        task: tasks.find((task) => task.id === assign_task_id),
      });
    } else {
      console.error("User not found in organizationUsers");
    }
  };

  // initial fetch of all data
  useEffect(() => {
    fetchAllData();
    fetchUsersInOrganization();
  }, []);

  // useEffect for changes in columns and tasks with socket.io
  useEffect(() => {
    if (updateBoard) {
      fetchAllData();
      socket.emit("columnData", columns);

      const handleColumnData = (data) => {
        console.log("Received column data:", data);
        fetchAllData();
      };
      socket.on("reciveColumnData", handleColumnData);
      setUpdateBoard(false);
      return () => {
        socket.off("reciveColumnData", handleColumnData);
      };
    }
  }, [updateBoard]);

  useEffect(() => {
    fetchAllData();
    const handleData = (data) => {
      console.log("Received task data:", data);
      fetchAllData();
    };
    const boardData = { columns: columns, tasks: tasks };
    socket.emit("kanbanData", boardData);
    socket.on("reciveKanbanData", handleData);
    return () => {
      socket.off("reciveKanbanData", handleData);
    };
  }, [updateBoard]);

  const columnColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"];
  return (
    <div className="main-div">
      <div>
        <nav className="tool-bar">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsAddColumnOpen(true);
            }}
            className="nav-button"
          >
            Add Column
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsKanbanOpen(true);
            }}
          >
            Share Kanban
          </button>
        </nav>
      </div>
      <div className="board">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.column_id === column.id
            );
            return (
              <Column
                key={column.id}
                id={column.id}
                column={column}
                tasks={columnTasks}
                deleteColumn={deleteColumn}
                addTask={addTask}
                editColumn={editColumn}
                deleteTask={deleteTask}
                editTask={editTask}
                orgUsers={organizationUsers}
                assignTaskToUser={assignTaskToUser}
                color={columnColors[column.id % columnColors.length]}
              />
            );
          })}
        </DndContext>
        <Modal
          className="board-modal"
          isOpen={isAddColumnOpen}
          onClose={() => setIsAddColumnOpen(false)}
        >
          <input
            type="text"
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Column Name"
          />
          <button onClick={handleAddColumn}>Save</button>
        </Modal>

        <Modal
          className="board-modal"
          isOpen={isShareKanbanOpen}
          onClose={() => setIsKanbanOpen(false)}
        >
          <div className="share-kanban">
            <select
              className="dropdown-menu-kanban"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled selected>
                General Access
              </option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <input
              type="text"
              value={inviteEmail}
              onChange={handleEmailChange}
              placeholder="Enter Email"
            ></input>
            {/* Display autocomplete suggestions */}
            {filteredUsers.length > 0 && (
              <ul className="autocomplete-list">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => {
                      setEmail(user.email); // Set the selected email
                      setFilteredUsers([]); // Clear suggestions
                    }}
                  >
                    {user.email}
                  </li>
                ))}
              </ul>
            )}

            <button onClick={handleShareKanban}>Send Invite</button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
