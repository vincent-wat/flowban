const users = require('../models/user');
const pool = require('../models/db');
const queries = require('../models/queries');


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

const postUsers = async (req,res) => {
    console.log("inserting a new user");
    try {
        const { email, password, phone_number, first_name, last_name, user_role } = req.body;
        const result = pool.query("INSERT INTO users (email, password, phone_number, first_name, last_name, user_role) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *",
      [email, password, phone_number || null, first_name, last_name, user_role || null])
      res.status(201);
      console.log("User Inserted");
    } catch (e) {
        console.error(e.message);
    }
};


module.exports = {
    getUsers,
    postUsers,
};