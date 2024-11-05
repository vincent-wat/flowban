// allow for routes to database 
// ex /api/users

const { Router } = require('express');
const controller = require('../Controllers/UserController');
const router = Router();

// The functions will be handled by the controller file 
router.get("/", controller.getUsers);
router.post("/", controller.postUsers);

router.get("/:id", controller.getUserById);  // Route for getting a user by ID
router.put("/:id", validateUpdateUser, controller.updateUserProfile);
router.delete("/:id", controller.deleteUser)

router.get("/email/:email", controller.getUserByEmail);


// update User Profile validation of user informtion
const { body, validationResult } = require('express-validator');
const { updateUserProfile } = require('../Controllers/UserController');

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



module.exports = router;