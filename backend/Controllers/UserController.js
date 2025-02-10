const bcrypt = require("bcrypt");
const User = require("../models/User"); 
const Role = require("../models/Role");
const pool = require("../models/db");
const queries = require("../models/queries");
const { jwtGenerator, jwtGeneratorExpiry } = require("../utils/jwtGenerator");
const nodemailer = require("nodemailer");

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

//Find user by token
async function getUserByResetToken(req, res) {
  try {
    const { token } = req.params; 
    const user = await pool.query(queries.findUserByResetToken, [token]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
}


//Create a new user
async function postUser(req, res) {
  console.log("Inserting a new user");

  try {
    const { email, password, phone_number, first_name, last_name, additional_roles = [] } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      phone_number,
      first_name,
      last_name,
    }, { logging: console.log }); 

    const userRole = await Role.findOne({ where: { name: "user" } });

    const roleIds = [userRole.id, ...additional_roles];

    for (const roleId of roleIds) {
      await newUser.addRole(roleId, {
        through: { user_id: newUser.id, role_id: roleId },
      });
    }

    const jwtToken = jwtGenerator(newUser.id);

    console.log("User Inserted");
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      jwtToken,
    });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ message: "Server error", error: err.errors || err.message });
  }
}



//Login a user
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    // Find user by email using Sequelize
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtToken = jwtGenerator(user.id);

    console.log("User logged in");
    return res.status(200).json({
      message: "Login successful",
      jwtToken,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await pool.query(queries.findUserByEmail, [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a password reset token
    const jwtToken = jwtGeneratorExpiry(user.rows[0].email);
    console.log("Reset token:", jwtToken);

    // Assign the token to the user
    await pool.query(queries.insertResetToken, [jwtToken, email]);

    // Create a password reset link
    const resetLink = `http://localhost:3001/reset-password?token=${jwtToken}`;
    
    // Send email with password reset link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: 'FlowBan <workflowban@gmail.com>',
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password\n${resetLink}`,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function resetPassword(req, res) {
  const { password, password_reset_token } = req.body;
  try {
    // Hash the password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(queries.resetPassword, [hashedPassword, password_reset_token]);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (e) {
    console.error("Error resetting password:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Update a user profile
async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email, phone_number, first_name, last_name } = req.body;

    // Find user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided in the request body
    await user.update({
      email: email || user.email,
      phone_number: phone_number || user.phone_number,
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
    });

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

//grabing current user
const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID from req.user:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find user by primary key using Sequelize
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "phone_number", "first_name", "last_name", "created_at"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//Delete a user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(queries.deleteUser, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
}
async function assignRoleToUser(userId, roleId) {
  try {
    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      console.error("User or Role not found.");
      return;
    }

    await user.addRole(role, { through: {} });

    console.log(`Role ${roleId} assigned to User ${userId}`);
  } catch (err) {
    console.error("Error assigning role:", err.message);
  }
}



module.exports = {
  getUsers,
  postUser,
  deleteUser,
  updateUserProfile,
  getUserByID,
  getUserByEmail,
  getUserByResetToken,
  loginUser,
  getCurrentUserProfile,
  forgotPassword,
  resetPassword,
  assignRoleToUser,
};
