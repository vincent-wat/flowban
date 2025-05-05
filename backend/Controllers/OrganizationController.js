const { Organization, User, UserRole, sequelize} = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateInviteToken = require("../utils/inviteToken");
const sendOrganizationInviteEmail = require("../middleware/sendEmail");
const { jwtOrganizationGenerator } = require("../utils/jwtGenerator");
const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: "Organization name is required" });
    }

    // Check if organization name already exists
    const existing = await Organization.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Organization name already exists" });
    }

    // Use a transaction to ensure all operations complete or roll back
    const result = await sequelize.transaction(async (t) => {
      // Create the organization
      const org = await Organization.create({ name }, { transaction: t });

      // Update the user with the organization ID
      await User.update(
        { organization_id: org.id },
        { 
          where: { id: userId },
          transaction: t 
        }
      );

      // Create UserRole record directly with SQL to bypass model issues
      await sequelize.query(`
        INSERT INTO user_roles (user_id, role_id, assigned_at, created_at, updated_at) 
        VALUES (:userId, 2, NOW(), NOW(), NOW())
      `, {
        replacements: { userId },
        type: sequelize.QueryTypes.INSERT,
        transaction: t
      });

      return org;
    });

    // Generate a new JWT token for the user that includes their organization ID
    const user = await User.findByPk(userId);
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        organization_id: user.organization_id 
      },
      process.env.jwtSecret,
      { expiresIn: "24hr" }
    );

    res.status(201).json({ 
      message: "Organization created and admin role assigned", 
      organization: result,
      jwtToken: token
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const inviteUserToOrganization = async (req, res) => {
  try {
    const { email } = req.body;
    const userID = req.user.id;
    const orgID = req.user.organization_id;
    if(!orgID) {
        return res.status(401).json({ error: "Unauthorized: Organization ID not found" });
    }
  
    const token = jwtOrganizationGenerator(email, { organization_id: orgID });
    
    await sendOrganizationInviteEmail(email, token);

    res.status(200).json({ message: "Invitation sent successfully" });
    } catch (error) {
    console.error("Error inviting user to organization:", error.message);
    res.status(500).json({ error: "Failed to send invitation", details: error.message });
    }
  
};

const acceptOrganizationInvite = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("Received token:", token);
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.jwtSecret);
    console.log("Decoded token:", decoded);
    const { email, organization_id } = decoded;
    console.log("Email:", email, "Organization ID:", organization_id);

    const org = await Organization.findByPk(organization_id);
    console.log("org is " + organization_id);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.organization_id) {
      return res.status(403).json({ error: "User already belongs to an organization" });
    }

    user.organization_id = organization_id;
    await user.save();

    // Generate a new JWT token that includes the organization_id
    const jwtToken = jwt.sign(
      { 
        id: user.id, 
        organization_id 
      }, 
      process.env.jwtSecret, 
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "You have successfully joined the organization",
      organization: org.name,
      jwtToken: jwtToken // <-- This is the new token with the organization_id
    });
  } catch (err) {
    console.error("Invite token error:", err);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};

const displayAllUsersInOrganization = async (req, res) => {
  try {
    // Get organization_id from the authenticated user
    const organization_id = req.user.organization_id;
    
    if (!organization_id) {
      return res.status(401).json({ error: "You don't belong to any organization" });
    }

    // Get all users in the organization
    const users = await User.findAll({ 
      where: { organization_id },
      attributes: ['id', 'first_name', 'last_name', 'email'] // Only return safe fields
    });
    
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found in this organization" });
    }
    
    res.status(200).json({
      message: "Users in the organization",
      users: users
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({error: "Organization not found."});
    }

    res.status(200).json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({error: "Server error"});
  }
};
  
  module.exports = {
    createOrganization,
    inviteUserToOrganization,
    acceptOrganizationInvite,
    displayAllUsersInOrganization,
    getOrganizationById
  }
