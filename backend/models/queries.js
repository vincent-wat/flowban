// used to create shorthand for common queries to the database

const getUsers = "SELECT * FROM users";
const postUsers = "INSERT INTO users"; 
const getBoards = "SELECT * FROM boards";
const getColumns = "SELECT * FROM columns";
const getTasks = "SELECT * FROM tasks";
const getTodos = "SELECT * FROM todo";



module.exports = {
    getBoards,
    getColumns,
    getUsers,
    getTasks,
    getTodos,
};