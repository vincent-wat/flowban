const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  jwt.verify(token, process.env.jwtSecret, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ message: 'Invalid token, authorization denied' });
    }

    console.log("Decoded User from JWT:", user); 
    req.user = user; // Attach the decoded user to req.user
    next();
  });  
};

module.exports = authenticateToken;