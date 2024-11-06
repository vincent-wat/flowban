const users = require("../models/user");
const pool = require("../models/db");
const queries = require("../models/queries");

// this is to get all users from the local database
// this can then be used to create more functions for database queries
// use the queries file to shorthand the queries
async function getUsers(req, res) {
  console.log("getting users");
  try {
    const allUsers = await pool.query(queries.getUsers);
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
}

//Find user by ID number
async function getUserByID(req, res) {
  try {
    const { id } = req.params;
    const user = await pool.query(queries.findUser, [id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
}

//Find user by email
async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;
    const user = await pool.query(queries.findUserByEmail, [email]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
}

//Create a new user
async function postUsers(req, res) {
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
}

//Update a user profile
const { findUser, updateUser } = require("../models/queries");

async function updateUserProfile(req, res) {
  const userId = req.params.id;
  const { email, phone_number, first_name, last_name, user_role } = req.body;

  try {
    const userResult = await pool.query(findUser, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = userResult.rows[0];
    const updatedEmail = email || currentUser.email;
    const updatedPhoneNumber = phone_number || currentUser.phone_number;
    const updatedFirstName = first_name || currentUser.first_name;
    const updatedLastName = last_name || currentUser.last_name;
    const updatedUserRole = user_role || currentUser.user_role;

    const values = [
      updatedEmail,
      updatedPhoneNumber,
      updatedFirstName,
      updatedLastName,
      updatedUserRole,
      userId,
    ];
    const updateResult = await pool.query(updateUser, values);

    return res
      .status(200)
      .json({
        message: "User updated successfully",
        user: updateResult.rows[0],
      });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//Delete a user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query(queries.deleteUser, [id]);
    res.json("A user was deleted");
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
  getUsers,
  postUsers,
  deleteUser,
  updateUserProfile,
  getUserByID,
  getUserByEmail,
};
