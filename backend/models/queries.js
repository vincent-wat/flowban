// used to create shorthand for common queries to the database

const getUsers = "SELECT * FROM users";
const postUsers = "INSERT INTO users"; 
const getBoards = "SELECT * FROM boards";
const getColumns = "SELECT * FROM columns";
const deleteUser = "DELETE FROM users WHERE id = $1"



module.exports = {
    getBoards,
    getColumns,
    getUsers,
    postUsers,
    deleteUser
};