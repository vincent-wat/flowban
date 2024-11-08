const bcrypt = require("bcrypt");
const users = require("../models/user");
const pool = require("../models/db");
const queries = require("../models/queries");
const jwtGenerator = require("../utils/jwtGenerator");

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
async function postUser(req, res) {
  console.log("inserting a new user");
  try {
    const { email, password, phone_number, first_name, last_name, user_role } = req.body;

    // Hash the password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      "INSERT INTO users (email, password, phone_number, first_name, last_name, user_role) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *",
      [
        email,
        hashedPassword,
        phone_number || null,
        first_name,
        last_name,
        user_role || null,
      ]
    );
    const jwtToken = jwtGenerator(result.rows[0].user_id);

    console.log("User Inserted");
    res.status(201).json({ user: result.rows[0], jwtToken });
  } catch (err) {
    console.error(err.message);
  }
}

//Login a user
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }

    const jwtToken = jwtGenerator(user.rows[0].id);
    console.log("User logged in");
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
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
  postUser,
  deleteUser,
  updateUserProfile,
  getUserByID,
  getUserByEmail,
  loginUser,
};
