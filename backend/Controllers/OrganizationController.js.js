const { Organization, User } = require('../models');

const createOrganization = async (req, res) => {
  try {
    const { name, userId } = req.body;

    const existing = await Organization.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Organization name already exists" });
    }

    const org = await Organization.create({ name });

    if (userId) {
      await User.update(
        { organization_id: org.id },
        { where: { id: userId } }
      );
    }

    res.status(201).json({ message: "Organization created", organization: org });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const addUserToOrganization = async (req, res) => {
    try {
      const { userId, organizationId } = req.body;
  
      const user = await User.findByPk(userId);
      const org = await Organization.findByPk(organizationId);
  
      if (!user || !org) {
        return res.status(404).json({ message: "User or organization not found" });
      }
  
      user.organization_id = organizationId;
      await user.save();
  
      res.status(200).json({ message: "User added to organization", user });
    } catch (error) {
      console.error("Error adding user to organization:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  module.exports = {
    createOrganization,
    addUserToOrganization,
  }
