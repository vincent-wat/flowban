// allow for routes to database 
// If searching with ID use /id/:id and if searching with email use /email/:email

const controller = require('../Controllers/UserController');
const router = require("express").Router();
const validInfo = require("../middleware/validInfo");
const authenticateToken = require('../middleware/authMiddleware');

//Default route
router.post("/register", controller.postUser); // create a new user
router.post("/login", validInfo, controller.loginUser); // login user
router.post("/forgot-password", controller.forgotPassword); // forgot password
router.put("/reset-password", controller.resetPassword); // reset password
router.get("/token/:token", controller.getUserByResetToken); // get user by token

router.get("/", controller.getUsers); // get all users
//Routes with /id/:id
router.get("/id/:id", controller.getUserByID); // get user by ID
router.delete("/id/:id", controller.deleteUser); // delete user by ID

//Routes with /email/:email
router.get("/email/:email", controller.getUserByEmail); // get user by email

// update User Profile validation of user informtion
const { body, validationResult } = require('express-validator');

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
router.put("/me", authenticateToken, validateUpdateUser, controller.updateUserProfile);

//get user information
router.get('/me', authenticateToken, controller.getCurrentUserProfile);

router.get('/roles/:id', authenticateToken, controller.getCurrentUserProfile);

module.exports = router;