const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "/Users/andrew/Desktop/School/CSUN/COMP_490/flowban/backend/.env" });

// Replace these values with test data
const testPayload = {
  id: 30, // Replace with a valid user ID
  organization_id: 1, // Replace with a valid organization ID
};

const secret = process.env.jwtSecret; // Ensure this matches your .env file

if (!secret) {
  console.error("JWT secret is not defined in .env file");
  process.exit(1);
}

const token = jwt.sign(testPayload, secret, { expiresIn: "1h" });

console.log("Generated Test Token:", token);