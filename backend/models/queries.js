// used to create shorthand for common queries to the database

// User Queries
const getUsers = "SELECT * FROM users";
const postUsers = "INSERT INTO users"; 
const getColumns = "SELECT * FROM columns";
const deleteUser = "DELETE FROM users WHERE id = $1";
const updateUser = `
  UPDATE users
  SET email = $1, phone_number = $2, first_name = $3, last_name = $4, user_role = $5
  WHERE id = $6
  RETURNING *;
`;
const findUser = `
  SELECT * FROM users WHERE id = $1
`;

// Board Queries
const getBoards = "SELECT * FROM boards";
const getUserBoards = `SELECT * FROM boards WHERE id = $1`;
const getAllBoards = "SELECT * FROM boards";
const deleteBoardQuery = 'DELETE FROM boards WHERE id = $1 RETURNING *';
const updateBoardNameQuery = 'UPDATE boards SET name = $1 WHERE id = $2 RETURNING *';


module.exports = {
    getBoards,
    getColumns,
    getUsers,
    postUsers,
    deleteUser,
    updateUser,
    findUser,
    getUserBoards,
    getAllBoards,
    deleteBoardQuery,
    updateBoardNameQuery
};