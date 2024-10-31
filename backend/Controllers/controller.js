const users = require('./user');
const pool = require('./db');
const queries = require('./queries');


// this is to get all users from the local database
// this can then be used to create more functions for database queries
// use the queries file to shorthand the queries 
const getUsers = async (req, res) => {
    console.log("getting users");
    try {
        const allUsers = await pool.query(queries.getUsers);
        res.json(allUsers.rows);
    } catch (error) {
        console.error(error.message);
    }

    
};

module.exports = {
    getUsers,
};