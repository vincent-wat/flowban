const jwt = require("jsonwebtoken");

function generateInviteToken(email, organization_id) {
  const payload = { email, organization_id };

  return jwt.sign(payload, process.env.jwtSecret, {
    expiresIn: "2d", 
  });
}

module.exports = generateInviteToken;
