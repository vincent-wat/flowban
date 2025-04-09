const controller = require('../Controllers/oAuthController');
const router = require("express").Router();

// Make sure controller.getData is defined and exported properly
router.get("/", controller.getData);

module.exports = router;
