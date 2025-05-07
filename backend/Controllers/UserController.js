
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Role } = require("../models");
const { sequelize } = require("../models")
const pool = require("../models/db");
const queries = require("../models/queries");
const { jwtGenerator, jwtGeneratorExpiry } = require("../utils/jwtGenerator");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

// this is to get all users from the local database
// this can then be used to create more functions for database queries
// use the queries file to shorthand the queries

const getUsersFromOrg = async (req, res) => {
  try {
    const { organization_id } = req.user;

    if (!organization_id) {
      return res.status(400).json({ error: "Organization ID is required" });
    }

    const users = await User.findAll({
      where: { organization_id },
      attributes: ['id', 'first_name', 'last_name', 'email', 'organization_id']
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};



//Find user by ID number
async function getUserByID(req, res) {
  try {
    console.log("getting user by ID");
    const { id } = req.params;
    console.log("req.params " + req.params);
    const foundUser = await User.findByPk(id); // Use Sequelize to find the user by primary key
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(foundUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

//Find user by email
async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    } 
    res.json(foundUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

//Find user by token
async function getUserByResetToken(req, res) {
  try {
    const { token } = req.params; 
    console.log("token in get is " + token);
    const foundUser = await User.findOne({ where: { password_reset_token: token } });
    if (!foundUser) {
      console.log("User not found with token: " + token);
      return res.status(404).json({ message: "User not found" });
    }
    res.json(foundUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getUserRoles(req, res) {
  try {
    const userId = req.user.id;
    
    // Use direct SQL query to get roles
    const [roles] = await sequelize.query(`
      SELECT r.id, r.name 
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ?
    `, {
      replacements: [userId]
    });
    
    return res.status(200).json({ roles });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function refreshToken(req, res) {
  try {
    const userId = req.user.id;
    
    // Get the user from the database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Generate a new token with the user's current data
    const jwtToken = jwtGenerator(user);
    
    return res.status(200).json({
      message: "Token refreshed successfully",
      jwtToken
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ error: "Server error" });
  }
}


async function postUser(req, res) {
  console.log("Inserting a new user");

  try {
    const {
      email,
      password,
      phone_number,
      first_name,
      last_name
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      phone_number,
      first_name,
      last_name,
    });

    const userRole = await Role.findOne({ where: { name: "user" } });

    if (!userRole) {
      return res.status(500).json({
        message: "Default role 'user' not found in the database.",
      });
    }

    await newUser.addRole(userRole); 

    const jwtToken = jwtGenerator(newUser);

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
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          attributes: ['name'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userRole = user.roles?.[0]?.name || "user";

    const userWithRole = {
      id: user.id,
      organization_id: user.organization_id,
      role: userRole,
    };

    const jwtToken = jwtGenerator(userWithRole);
    console.log("User Roles:", user.roles?.map(r => r.name));


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
    const oneUser = await User.findOne({where : {email}});
    if (!oneUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //Generate a password reset token
    const jwtToken = jwtGeneratorExpiry(oneUser.id);
    console.log("Reset token: ", jwtToken);
    
    //Assign the token to the user
    oneUser.password_reset_token = jwtToken;
    await oneUser.save();

    //Create a password reset link
    const resetLink = `https://localhost:3001/reset-password?token=${jwtToken}`;

    //send email with password reset link
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
    // Find user by reset token
    const user = await User.findOne({where: { password_reset_token }});
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }
    // Hash the password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Store password and delete reset token
    user.password = hashedPassword;
    user.password_reset_token = null;
    await user.save();

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

async function changeUserRole(req, res) {
  try {
    const { userId, roleId } = req.body;

    // Check if requester is owner (role_id = 3)
    const [requesterRoles] = await sequelize.query(`
      SELECT r.id, r.name 
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ?
    `, {
      replacements: [req.user.id]
    });
    
    const isOwner = requesterRoles.some(role => role.id === 3 || role.name.toLowerCase() === 'owner');
    
    if (!isOwner) {
      return res.status(403).json({ error: 'Only organization owners can change user roles' });
    }
    
    await sequelize.transaction(async (t) => {
      // Check if a role already exists for this user
      const [existingRoles] = await sequelize.query(`
        SELECT id FROM user_roles WHERE user_id = ?
      `, {
        replacements: [userId],
        transaction: t
      });
      
      if (existingRoles.length > 0) {
        // Update existing role instead of delete+insert
        await sequelize.query(`
          UPDATE user_roles 
          SET role_id = ?, updated_at = NOW() 
          WHERE user_id = ?
        `, {
          replacements: [roleId, userId],
          transaction: t
        });
      } else {
        // Insert only if no role exists
        await sequelize.query(`
          INSERT INTO user_roles (user_id, role_id, assigned_at, created_at, updated_at) 
          VALUES (?, ?, NOW(), NOW(), NOW())
        `, {
          replacements: [userId, roleId],
          transaction: t
        });
      }
    });
    
    return res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error changing user role:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}



module.exports = {
  getUsersFromOrg,
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
  getUserRoles,
  refreshToken,
  changeUserRole,
};
