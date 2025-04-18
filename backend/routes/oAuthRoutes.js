const controller = require('../Controllers/oAuthController');
const router = require("express").Router();

router.get("/", controller.getData);

module.exports = router;
