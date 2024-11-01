const users = require("../models/user");
const pool = require("../models/db");
const queries = require("../models/queries");

// this is to get all users from the local database
// this can then be used to create more functions for database queries
// use the queries file to shorthand the queries
const getUsers = async (req, res) => {
  console.log("getting users");
  try {
    const allUsers = await pool.query(queries.getUsers);
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
};

const postUsers = async (req, res) => {
  console.log("inserting a new user");
  try {
    const { email, password, phone_number, first_name, last_name, user_role } =
      req.body;

    const result = await pool.query(
      "INSERT INTO users (email, password, phone_number, first_name, last_name, user_role) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *",
      [
        email,
        password,
        phone_number || null,
        first_name,
        last_name,
        user_role || null,
      ]
    );
    console.log("User Inserted");
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};

/* const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { email, phone_number, first_name, last_name, user_roles } = req.body;
  
    try {
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.update({
        email,
        phone_number,
        first_name,
        last_name,
        user_roles,
      });
  
      return res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  */

//Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query(queries.deleteUser, [id]);
    res.json("A user was deleted");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getUsers,
  postUsers,
  deleteUser,
};
