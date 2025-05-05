const { sequelize } = require('../models');

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.id;
    
    // Direct query to check if the user has admin role (id=2)
    const [results] = await sequelize.query(`
      SELECT ur.* 
      FROM user_roles ur
      WHERE ur.user_id = :userId AND ur.role_id = 2
    `, {
      replacements: { userId }
    });
    
    if (results.length === 0) {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    // User is an admin, proceed
    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = isAdmin;