const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
  //checks to see if token matches with key
  jwt.verify(token, process.env.jwtSecret, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ message: 'Invalid token, authorization denied' });
    }
    console.log("Decoded User from JWT:", user); 
    req.user = user;  
    next();
  });  
};

module.exports = authenticateToken;
