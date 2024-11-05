// used to create shorthand for common queries to the database

const getUsers = "SELECT * FROM users";
const postUsers = "INSERT INTO users"; 
const getBoards = "SELECT * FROM boards";
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
const getUserBoards = `SELECT * FROM boards WHERE id = $1`;
const getAllBoards = "SELECT * FROM boards";


module.exports = {
    getBoards,
    getColumns,
    getUsers,
    postUsers,
    deleteUser,
    updateUser,
    findUser,
    getUserBoards,
    getAllBoards
};