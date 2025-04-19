const jwt = require('jsonwebtoken');
require('dotenv').config();



function jwtGenerator(user) {
  const payload = { id: user.id, organization_id: user.organization_id,};
    const token = jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
    
    //console.log("Generated JWT:", token);

    //const decoded = jwt.decode(token);
    //console.log("Decoded Payload:", decoded);
  
    return token;
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