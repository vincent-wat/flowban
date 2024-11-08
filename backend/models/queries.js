// used to create shorthand for common queries to the database

// User Queries
const getUsers = "SELECT * FROM users";
const postUser = "INSERT INTO users";
const getColumns = "SELECT * FROM columns";
const deleteUser = "DELETE FROM users WHERE id = $1";
const updateUser = `
  UPDATE users
  SET email = $1, phone_number = $2, first_name = $3, last_name = $4, user_role = $5
  WHERE id = $6
  RETURNING *;
`;

// Finds a user using their ID
const findUser = `
  SELECT * FROM users WHERE id = $1
`;

//Finds a user using their email
const findUserByEmail = `
  SELECT * FROM users WHERE email = $1
`;

// Board Queries
const getBoards = "SELECT * FROM boards";
const getUserBoards = `SELECT * FROM boards WHERE id = $1`;
const getAllBoards = "SELECT * FROM boards";
const deleteBoardQuery = "DELETE FROM boards WHERE id = $1 RETURNING *";
const updateBoardNameQuery =
  "UPDATE boards SET name = $1 WHERE id = $2 RETURNING *";

// Column Queries
const getAllColumns = "SELECT * FROM columns";
const getColumn = "SELECT * FROM columns WHERE id = $1";
const getAllColumnsForBoard = "SELECT * FROM columns WHERE board_id = $1";
const deleteColumn = "DELETE FROM columns WHERE id = $1 RETURNING *";

// Task Queries
const getAllTasks = "SELECT * FROM tasks";
const getTask = "SELECT * FROM tasks WHERE id = $1";
const getAllTasksForColumn = "SELECT * FROM tasks WHERE column_id = $1";
const deleteTask = "DELETE FROM tasks WHERE id = $1 RETURNING *";

module.exports = {
  // users exports
  getBoards,
  getColumns,
  getUsers,
  findUserByEmail,
  postUser,
  deleteUser,
  updateUser,
  findUser,
  // boards exports
  getUserBoards,
  getAllBoards,
  deleteBoardQuery,
  updateBoardNameQuery,
  // columns exports
  getAllColumns,
  getColumn,
  getAllColumnsForBoard,
  deleteColumn,
  // tasks exports
  getAllTasks,
  getTask,
  getAllTasksForColumn,
  deleteTask,
};
