const jwt = require('jsonwebtoken');
require('dotenv').config();



<<<<<<< Updated upstream
function jwtGenerator(user_id) {
  const payload = { id: user_id };
    const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
    
    //console.log("Generated JWT:", token);
=======
function jwtGenerator(user) {
  const payload = {
    id: user.id, // Ensure the user ID is included
    organization_id: user.organization_id, // Include other fields if necessary
  };
>>>>>>> Stashed changes

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
}

  function jwtGeneratorExpiry(user_id) {
    const payload = { id: user_id };
      const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
      
      //console.log("Generated JWT:", token);
  
      //const decoded = jwt.decode(token);
      //console.log("Decoded Payload:", decoded);
    
      return token;
    }
  
  module.exports = {
    jwtGenerator,
    jwtGeneratorExpiry
  };