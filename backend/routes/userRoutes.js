const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../Controllers/UserController');
const router = Router();
const pool = require('../models/db');  // Ensure you have a db.js file for database connection

// The functions will be handled by the controller file
router.get("/", controller.getUsers);
router.post("/signup", controller.postUsers);  // Add the postUsers route
router.delete("/:id", controller.deleteUser);

// Update User Profile validation of user information
const { updateUserProfile } = require('../Controllers/UserController');



const postUsers = async (req, res) => {
  console.log("Inserting a new user");
  try {
    const { email, password, phone_number, first_name, last_name, user_role } = req.body;
    const result = await pool.query(
      "INSERT INTO users (email, password, phone_number, first_name, last_name, user_role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, password, phone_number || null, first_name, last_name, user_role || null]
    );
    res.status(201).json(result.rows[0]);
    console.log("User Inserted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const validateUpdateUser = [
  body('email').optional().isEmail().withMessage('Must be a valid email'),
  body('phone_number').optional().matches(/^[0-9\-+()]*$/).withMessage('Must be a valid phone number'),
  body('first_name').optional().isString().withMessage('First name must be a string'),
  body('last_name').optional().isString().withMessage('Last name must be a string'),
  body('user_role').optional().isIn(['Admin', 'User', 'Moderator']).withMessage('Invalid role'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.put("/:id", validateUpdateUser, updateUserProfile, postUsers);

module.exports = router;