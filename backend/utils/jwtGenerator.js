const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user) {
  const payload = {
    id: typeof user === "object" ? user.id : user,
    organization_id: user.organization_id || null,
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
}

function jwtOrganizationGenerator(email, user) {
  const payload = {
    email: email,
    organization_id: user.organization_id,
  };

  return jwt.sign(payload, process.env.jwtSecret);
}

function jwtGeneratorExpiry(user_id) {
  const payload = { id: user_id };
  const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });

  //console.log("Generated JWT:", token);

  //const decoded = jwt.decode(token);
  //console.log("Decoded Payload:", decoded);

  return token;
}

function jwtKanbanGenerator(email, board_id, role) {
  const payload = {
    email: email,
    board_id: board_id,
    role: role,
  };

  return jwt.sign(payload, process.env.jwtSecret);
}
module.exports = {
  jwtGenerator,
  jwtGeneratorExpiry,
  jwtOrganizationGenerator,
  jwtKanbanGenerator,
};
