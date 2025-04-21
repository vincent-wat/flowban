const { Organization, User } = require("../models");
const generateInviteToken = require("../utils/inviteToken");
const sendInviteEmail = require("../middleware/sendEmail");

const createOrganization = async (req, res) => {
  try {
    const { name, userId } = req.body;

    const existing = await Organization.findOne({ where: { name } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Organization name already exists" });
    }

    const org = await Organization.create({ name });

    if (userId) {
      await User.update({ organization_id: org.id }, { where: { id: userId } });
    }

    res
      .status(201)
      .json({ message: "Organization created", organization: org });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const inviteUserToOrganization = async (req, res) => {
  try {
    const { email, organizationId } = req.body;

    const token = generateInviteToken(email, organizationId);
    await sendInviteEmail(email, token);

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (err) {
    console.error("Error sending invite:", err);
    res.status(500).json({ error: "Failed to send invite" });
  }
};

const acceptOrganizationInvite = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.jwtSecret);
    const { email, organization_id } = decoded;

    const org = await Organization.findByPk(organization_id);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.organization_id) {
      return res
        .status(403)
        .json({ error: "User already belongs to an organization" });
    }

    user.organization_id = organization_id;
    await user.save();

    res.status(200).json({
      message: "You have successfully joined the organization",
      organization: org.name,
    });
  } catch (err) {
    console.error("Invite token error:", err);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};

module.exports = {
  createOrganization,
  inviteUserToOrganization,
  acceptOrganizationInvite,
};
